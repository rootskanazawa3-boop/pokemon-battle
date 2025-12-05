
## 1. バトル機能のゴール

* React だけで動く **1画面完結のバトルシステム**。
* まずは **1 vs 1 のシンプルバトル**（プレイヤー1体 vs 敵1体）。
* できること：

  * 自分・相手のモンスター表示（名前・レベル・HPバー）
  * コマンド選択：
    **「たたかう / モンスター / バッグ / にげる」**
  * 「たたかう」を選ぶと技4つから選択
  * ダメージ計算 → HPバーが減る → 勝敗判定
  * 下部にメッセージボックス（ログ1行ずつ表示）

※ あとで「手持ち6体」「ステータス異常」など拡張しやすい設計にしておく。

---

## 2. データ構造（超シンプル版）

### 2.1 モンスター

まずは「1体だけバトルする前提」でOK。
TypeScript 風で書くけど、JavaScript なら `: 型` を消せばそのまま使えるイメージ。

```ts
type Monster = {
  id: string;
  name: string;
  level: number;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  speed: number;
  // とりあえず単タイプのみ
  type: "fire" | "water" | "grass" | "normal";
  moves: Move[];
};
```

### 2.2 技（Move）

```ts
type Move = {
  id: string;
  name: string;
  power: number;   // 0ならダメージなし（バフ技など用）
  accuracy: number; // 0〜100
  type: "fire" | "water" | "grass" | "normal";
};
```

### 2.3 バトル状態（BattleState）

**初心者でもわかりやすいように**、状態はかなりシンプルにする。

```ts
type BattlePhase =
  | "intro"          // バトル開始演出
  | "commandSelect"  // コマンド選択（たたかう/モンスター/バッグ/にげる）
  | "moveSelect"     // 技選択
  | "action"         // ダメージ処理中
  | "result";        // 勝敗表示

type BattleTurnLog = {
  id: number;
  text: string;
};

type BattleState = {
  player: Monster;
  enemy: Monster;
  phase: BattlePhase;
  selectedCommand: "fight" | "monster" | "bag" | "run" | null;
  selectedMoveIndex: number | null;
  isPlayerTurn: boolean;
  log: BattleTurnLog[]; // 最新を一番下に
  winner: "player" | "enemy" | "none";
};
```

### 2.4 初期データの例

```ts
const playerMonster: Monster = {
  id: "flameling",
  name: "フレイム",
  level: 5,
  maxHp: 20,
  currentHp: 20,
  attack: 10,
  defense: 8,
  speed: 7,
  type: "fire",
  moves: [
    { id: "tackle", name: "たいあたり", power: 40, accuracy: 100, type: "normal" },
    { id: "ember", name: "ひのこ", power: 40, accuracy: 100, type: "fire" },
  ],
};

const enemyMonster: Monster = {
  id: "leafy",
  name: "リーフィ",
  level: 5,
  maxHp: 18,
  currentHp: 18,
  attack: 9,
  defense: 7,
  speed: 5,
  type: "grass",
  moves: [
    { id: "tackle", name: "たいあたり", power: 40, accuracy: 100, type: "normal" },
  ],
};
```

---

## 3. ターンの流れ（ロジック仕様）

### 3.1 全体の流れ

1. `phase = "intro"`

   * 「野生の◯◯があらわれた！」的なメッセージを出す。
   * 決定キー or ボタン押下で `phase = "commandSelect"` に遷移。
2. `phase = "commandSelect"`

   * コマンドメニュー表示（たたかう/モンスター/バッグ/にげる）
   * 「たたかう」を選ぶ → `phase = "moveSelect"`
   * 「にげる」 → 成功率固定（仮で 100% or 50%）で逃げる → `phase = "result"`
   * 他2つは最初は未実装でもOK（押したら「まだ実装してないよ」メッセージを出す）
3. `phase = "moveSelect"`

   * 自分の技一覧を表示（最大4つ）
   * 技を選択したら：

     * `selectedMoveIndex` に保存
     * `phase = "action"` に遷移
4. `phase = "action"`

   * 1ターン分の処理
   * シンプルに：

     * ① 素早さ比較で行動順を決定
     * ② プレイヤー行動 → ダメージ計算 → HP更新 → 倒れたかチェック
     * ③ 敵が生きてれば 敵行動 → ダメージ計算 → HP更新
   * ④ 両方生きていれば `phase = "commandSelect"` に戻る
     どちらかHP0 → `winner` をセットして `phase = "result"`
5. `phase = "result"`

   * 「勝った！」 or 「負けた…」メッセージ
   * ボタン押下でバトル終了（親コンポーネントに終了を通知）

### 3.2 ダメージ計算（初心者向け・単純化）

* めちゃシンプルにする：

```ts
// typeMultiplier は今は全部1でもOK（あとからタイプ相性を足せる）
function calcDamage(attacker: Monster, defender: Monster, move: Move): number {
  const base = ((attacker.attack / defender.defense) * move.power) + 2;
  const random = 0.85 + Math.random() * 0.15; // 0.85〜1.0
  const damage = Math.floor(base * random);
  return Math.max(1, damage);
}
```

* 攻撃の流れ：

  1. accuracy 判定：`Math.random() * 100 < move.accuracy` で命中か判定
  2. 命中なら `calcDamage` でダメージ → `currentHp` から引く
  3. 0未満にならないように `max(0, currentHp - damage)`

---

## 4. React 構成（初心者向け＋シンプル）

### 4.1 コンポーネント構成

**最小構成**

* `BattleScreen`
  バトル全体の親コンポーネント。`useState` で `battleState` を持つ。
* 子コンポーネント：

  * `MonsterPanel`（自分・敵それぞれ）
  * `HpBar`
  * `CommandMenu`
  * `MoveMenu`
  * `MessageBox`

イメージ：

```tsx
<BattleScreen>
  <div className="battle-layout">
    <div className="battle-top-row">
      <MonsterPanel monster={enemy} align="right" />
    </div>

    <div className="battle-middle-row">
      <MonsterPanel monster={player} align="left" />
    </div>

    <div className="battle-bottom-row">
      <MessageBox text={currentMessage} />
      {phase === "commandSelect" && (
        <CommandMenu onSelect={handleCommandSelect} />
      )}
      {phase === "moveSelect" && (
        <MoveMenu moves={player.moves} onSelect={handleMoveSelect} />
      )}
    </div>
  </div>
</BattleScreen>
```

### 4.2 各コンポーネントの責務

#### `BattleScreen`

* `useState<BattleState>` を保持
* `handleCommandSelect(command)` で `selectedCommand` を更新
* `handleMoveSelect(index)` で技インデックスをセット → `runTurn()` を呼ぶ
* `runTurn()` の中で、上記「ターンの流れ」に従って `BattleState` を更新
* ログ（`state.log`）の最後の1件を `MessageBox` に渡す

#### `MonsterPanel`

* 表示：

  * モンスター名
  * Lv
  * HPバー（`HpBar`を使用）
  * 小さなモンスター画像（とりあえずプレースホルダーでもOK）

Props 例：

```ts
type MonsterPanelProps = {
  monster: Monster;
  align: "left" | "right";
  isPlayer?: boolean;
};
```

#### `HpBar`

* 最大HPに対しての現在HP割合でバーの長さを決める
* 色はHP割合によって変化させると「それっぽい」：

  * 50%以上：緑
  * 20〜49%：オレンジ
  * 19%以下：赤

#### `CommandMenu`

* 「たたかう / モンスター / バッグ / にげる」の4つをボタンで表示
* キー操作に対応させるなら、`onKeyDown` でカーソル移動も可（最初はマウスクリックだけでもOK）

Props 例：

```ts
type CommandMenuProps = {
  onSelect: (command: "fight" | "monster" | "bag" | "run") => void;
};
```

#### `MoveMenu`

* 自分の技の一覧をボタンで表示（最大4つ）
* ボタンを押したら `onSelect(index)` を呼ぶ

#### `MessageBox`

* 現在のメッセージ1行を表示
* シンプルな四角＋ドット絵風の枠線＋左右に余白

---

## 5. デザイン仕様（シンプル実装・高見た目）

「**コードは簡単、見た目は手を抜かない**」ためのガイドライン。

### 5.1 レイアウト

* 全体のゲーム画面：
  正方形に近い比率（例：**480x360px**）を中央に固定。
* 見た目：

  * 背景：部屋や草むらのイラストがなくてもOK。
    とりあえず「グラデーション背景 + モンスター枠」でそれっぽく。
* センタリング：

```css
.battle-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #2d3a5a, #050814);
}

.battle-layout {
  width: 480px;
  height: 360px;
  background: linear-gradient(180deg, #cde4ff 0%, #f5f5f5 40%, #dcd7ff 100%);
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  padding: 12px;
  display: grid;
  grid-template-rows: 1.2fr 1fr 1.2fr;
  gap: 8px;
}
```

### 5.2 モンスター表示

```css
.monster-panel {
  max-width: 60%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.monster-panel--right {
  margin-left: auto;
}

.monster-panel--left {
  margin-right: auto;
}

.monster-name-row {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 14px;
}

.hp-bar-container {
  width: 100%;
  height: 8px;
  background: #ddd;
  border-radius: 999px;
  overflow: hidden;
}

.hp-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}
```

* HPバー色は JS 側でクラスを分けてもいいし、style直接指定でもOK。

### 5.3 メッセージボックス

```css
.message-box {
  width: 100%;
  height: 90px;
  background: #ffffff;
  border-radius: 12px;
  border: 2px solid #333;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  align-items: center;
}
```

### 5.4 コマンドメニュー / 技メニュー

* メッセージボックスの **上か右側に重ねる**イメージ。
* ボタンは「角丸・影・ホバー時に浮く」感じにするとそれっぽい。

```css
.command-menu {
  margin-top: 6px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.command-button {
  border: none;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 14px;
  background: #f0f0ff;
  box-shadow: 0 2px 0 #888;
  cursor: pointer;
  transition: transform 0.05s ease, box-shadow 0.05s ease;
}

.command-button:active {
  transform: translateY(2px);
  box-shadow: 0 0 0 #888;
}
```

---

## 6. 実装ステップ（バトル機能だけ作るときの順番）

1. **静的なレイアウトだけ作る**

   * ダミーの `playerMonster`, `enemyMonster` を固定値で表示
   * `BattleScreen` + `MonsterPanel` + `MessageBox` + `CommandMenu` を表示
   * HPバーは固定値でOK
2. **`BattleState` を useState で持つ**

   * `phase`, `log` などの形を決める
   * 「たたかう」をクリックしたら `phase = "moveSelect"` になるようにしてみる
3. **`MoveMenu` を作る**

   * 技リストをボタンで表示
   * 押したら `selectedMoveIndex` をセット
4. **攻撃ロジック (`calcDamage`) を実装**

   * ターン処理を1つの関数 `runTurn()` にまとめる
   * `setState` の中でプレイヤー・敵のHPを更新
5. **勝敗判定・結果画面のメッセージ**

   * HPが0になったら `winner` をセットして `phase = "result"`
   * `result` ではコマンドを隠し、「もう一度」ボタンなど出す

---

## 7. まとめ

* これは **「バトル画面だけ」** に絞った仕様なので、

  * マップ移動
  * 捕獲
  * EXP/レベルアップ
    は一旦切り離してます。
* コードは

  * 型もフィールドも「最低限」にして
  * `useState` だけで完結するようにしたので
    **初心者でも1ファイルずつ追いかけやすい構成**になってます。
* デザインは

  * 1画面中央に固定
  * カード風のパネル
  * HPバー・ボタンにアニメーション少し
    を入れるだけで「安っぽさ」はかなり消せます。
