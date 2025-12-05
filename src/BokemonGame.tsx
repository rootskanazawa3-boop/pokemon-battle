import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Zap, Flame, Droplet, Leaf, Bug, Ghost, Moon, Star, Wind, Mountain } from 'lucide-react';

interface Bokemon {
  id: number;
  name: string;
  type: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  icon: React.ElementType; // Lucide icon component
  color: string;
  bgColor: string;
  emoji: string;
  moves: string[];
  isFainted?: boolean; // 新しく追加
}

const BokemonGame: React.FC = () => {
  const bokemonData: Bokemon[] = [
    { id: 1, name: 'ピカチュー', type: '電気', hp: 100, maxHp: 100, attack: 25, defense: 20, icon: Zap, color: 'text-yellow-400', bgColor: 'bg-yellow-100', emoji: '⚡', moves: ['でんきショック', 'でんこうせっか', '10まんボルト', 'かみなり'] },
    { id: 2, name: 'ヒトカゲ', type: '炎', hp: 95, maxHp: 95, attack: 28, defense: 18, icon: Flame, color: 'text-red-500', bgColor: 'bg-red-100', emoji: '🔥', moves: ['ひのこ', 'ひっかく', 'かえんほうしゃ', 'きりさく'] },
    { id: 3, name: 'ゼニガメ', type: '水', hp: 105, maxHp: 105, attack: 22, defense: 25, icon: Droplet, color: 'text-blue-500', bgColor: 'bg-blue-100', emoji: '🐢', moves: ['みずでっぽう', 'たいあたり', 'ハイドロポンプ', 'からにこもる'] },
    { id: 4, name: 'フシギダネ', type: '草', hp: 110, maxHp: 110, attack: 24, defense: 23, icon: Leaf, color: 'text-green-500', bgColor: 'bg-green-100', emoji: '🌱', moves: ['つるのムチ', 'やどりぎのタネ', 'ソーラービーム', 'はっぱカッター'] },
    { id: 5, name: 'キャタピー', type: '虫', hp: 85, maxHp: 85, attack: 15, defense: 15, icon: Bug, color: 'text-lime-600', bgColor: 'bg-lime-100', emoji: '🐛', moves: ['たいあたり', 'いとをはく', 'むしくい', 'かたくなる'] },
    { id: 6, name: 'ポッポ', type: '飛行', hp: 90, maxHp: 90, attack: 20, defense: 17, icon: Wind, color: 'text-sky-400', bgColor: 'bg-sky-100', emoji: '🦅', moves: ['つつく', 'かぜおこし', 'つばさでうつ', 'でんこうせっか'] },
    { id: 7, name: 'ゴースト', type: 'ゴースト', hp: 80, maxHp: 80, attack: 30, defense: 15, icon: Ghost, color: 'text-purple-600', bgColor: 'bg-purple-100', emoji: '👻', moves: ['したでなめる', 'あやしいひかり', 'シャドーボール', 'ナイトヘッド'] },
    { id: 8, name: 'イワーク', type: '岩', hp: 120, maxHp: 120, attack: 26, defense: 35, icon: Mountain, color: 'text-gray-600', bgColor: 'bg-gray-100', emoji: '🪨', moves: ['いわおとし', 'しめつける', 'いわなだれ', 'すなあらし'] },
    { id: 9, name: 'ピッピ', type: 'フェアリー', hp: 115, maxHp: 115, attack: 21, defense: 22, icon: Star, color: 'text-pink-400', bgColor: 'bg-pink-100', emoji: '⭐', moves: ['はたく', 'うたう', 'ゆびをふる', 'メトロノーム'] },
    { id: 10, name: 'プリン', type: 'ノーマル', hp: 125, maxHp: 125, attack: 18, defense: 20, icon: Heart, color: 'text-pink-300', bgColor: 'bg-pink-50', emoji: '🎀', moves: ['はたく', 'うたう', 'ころがる', 'のしかかり'] },
    { id: 11, name: 'ニャース', type: 'ノーマル', hp: 92, maxHp: 92, attack: 23, defense: 19, icon: Moon, color: 'text-amber-400', bgColor: 'bg-amber-50', emoji: '😸', moves: ['ひっかく', 'かみつく', 'ネコにこばん', 'きりさく'] },
    { id: 12, name: 'コダック', type: '水', hp: 98, maxHp: 98, attack: 24, defense: 21, icon: Droplet, color: 'text-cyan-500', bgColor: 'bg-cyan-100', emoji: '🦆', moves: ['ひっかく', 'みずでっぽう', 'ねんりき', 'サイコキネシス'] }
  ];

  const [playerTeam, setPlayerTeam] = useState<Bokemon[]>([]);
  const [playerBokemon, setPlayerBokemon] = useState<Bokemon | null>(null);
  const [enemyBokemon, setEnemyBokemon] = useState<Bokemon | null>(null);
  const [gameState, setGameState] = useState<'teamSelection' | 'battle' | 'defeat' | 'victory'>('teamSelection');
  const [message, setMessage] = useState<string>('チームを選んでください! (3体まで)');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showMoves, setShowMoves] = useState<boolean>(false);
  const [enemyDefeated, setEnemyDefeated] = useState<number>(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [attackAnimation, setAttackAnimation] = useState<'player' | 'enemy' | null>(null);
  const [showSwitchMenu, setShowSwitchMenu] = useState<boolean>(false); // 交代メニュー表示状態

  // 効果音を生成する関数 (ユーザー提供コード)
  const playSound = (type: string, moveName: string = '') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 技名に基づいた効果音
    if (type === 'move') {
      if (moveName.includes('でんき') || moveName.includes('ボルト') || moveName.includes('かみなり')) {
        oscillator.type = 'square';
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.type = 'square';
            osc2.frequency.value = 1000 + Math.random() * 500;
            gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.05);
          }, i * 40);
        }
        return;
      } else if (moveName.includes('ひのこ') || moveName.includes('炎') || moveName.includes('かえん')) {
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 150;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        return;
      } else if (moveName.includes('みず') || moveName.includes('ハイドロ')) {
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        for (let i = 0; i < 3; i++) {
          oscillator.frequency.setValueAtTime(800 - i * 150, audioContext.currentTime + i * 0.1);
        }
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        return;
      } else if (moveName.includes('つる') || moveName.includes('はっぱ') || moveName.includes('ソーラー')) {
        oscillator.type = 'triangle';
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(900, audioContext.currentTime + 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.25);
        return;
      } else if (moveName.includes('いわ') || moveName.includes('すな')) {
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 80;
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        return;
      } else if (moveName.includes('シャドー') || moveName.includes('ゴースト') || moveName.includes('ナイト')) {
        oscillator.type = 'sine';
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        return;
      } else if (moveName.includes('かぜ') || moveName.includes('つばさ')) {
        oscillator.type = 'sine';
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        return;
      } else if (moveName.includes('ねんりき') || moveName.includes('サイコ')) {
        oscillator.type = 'sine';
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.type = 'sine';
            osc2.frequency.value = 500 + i * 100;
            gain2.gain.setValueAtTime(0.15, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.2);
          }, i * 80);
        }
        return;
      } else {
        oscillator.type = 'square';
        oscillator.frequency.value = 400;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        return;
      }
    }
    
    switch(type) {
      case 'select':
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'damage':
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 100;
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'victory':
        oscillator.frequency.value = 523;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
      case 'defeat':
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 300;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
      case 'switch':
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'heal':
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
    }
  };

  const selectTeamMember = (bokemon: Bokemon) => {
    playSound('select');
    if (playerTeam.length < 3 && !playerTeam.find(b => b.id === bokemon.id)) {
      setPlayerTeam(prevTeam => [...prevTeam, { ...bokemon }]);
      if (playerTeam.length + 1 === 3) { // setPlayerTeamは非同期なので+1でチェック
        setMessage('チームが完成! バトル開始をクリック!');
      } else {
        setMessage(`あと${3 - (playerTeam.length + 1)}体選んでください`);
      }
    }
  };

  const removeFromTeam = (bokemonId: number) => {
    const newTeam = playerTeam.filter(b => b.id !== bokemonId);
    setPlayerTeam(newTeam);
    setMessage(newTeam.length === 3 ? 'チームが完成! バトル開始をクリック!' : `あと${3 - newTeam.length}体選んでください`);
  };

  const startBattle = () => {
    if (playerTeam.length !== 3) return;
    
    playSound('select');
    // チームのHPをリセット
    const resetTeam = playerTeam.map(b => ({ ...b, hp: b.maxHp, isFainted: false }));
    setPlayerTeam(resetTeam);
    
    // playerBokemon, enemyBokemonはstateのコピーを使用
    const initialPlayerBokemon = { ...resetTeam[0], isFainted: false };
    const initialEnemyBokemon = { ...bokemonData[Math.floor(Math.random() * bokemonData.length)], isFainted: false };
    
    setPlayerBokemon(initialPlayerBokemon);
    setEnemyBokemon(initialEnemyBokemon);
    setCurrentPlayerIndex(0);
    setGameState('battle');
    setMessage(`野生の${initialEnemyBokemon.name}が現れた!`);
  };

  const useMove = (moveName: string) => {
    if (isAnimating || gameState !== 'battle' || !playerBokemon || !enemyBokemon) return;
    
    setIsAnimating(true);
    setShowMoves(false);
    setAttackAnimation('player');
    
    // プレイヤーの攻撃
    const baseDamage = playerBokemon.attack;
    const damage = Math.floor(baseDamage * (0.8 + Math.random() * 0.4));
    
    setMessage(`${playerBokemon.name}の ${moveName}!`);
    playSound('move', moveName);

    setTimeout(() => {
      setAttackAnimation(null);
      playSound('damage');
      
      setEnemyBokemon(prev => {
        if (!prev) return null;
        const newEnemyHp = Math.max(0, prev.hp - damage);
        setMessage(`${damage}のダメージ!`);
        return { ...prev, hp: newEnemyHp };
      });
      
      // HP更新後の状態を正確に取得するため、useEffectまたは非同期処理のチェーンで扱う
      // ここでは簡略化のためsetTimeoutで擬似的に待つ
      setTimeout(() => {
        setEnemyBokemon(prev => {
          if (!prev) return null;
          if (prev.hp === 0) {
            playSound('victory');
            setEnemyDefeated(prevCount => prevCount + 1);
            setMessage(`${prev.name}を倒した!`);
            setGameState('victory'); // 勝利状態
            setIsAnimating(false);
            return { ...prev, isFainted: true };
          } else {
            // 敵の反撃
            enemyAttackTurn();
            return prev;
          }
        });
      }, 1000);
    }, 800);
  };

  const enemyAttackTurn = () => {
    if (!playerBokemon || !enemyBokemon) return;
    
    setTimeout(() => {
      setAttackAnimation('enemy');
      const enemyMove = enemyBokemon.moves[Math.floor(Math.random() * enemyBokemon.moves.length)];
      const enemyDamage = Math.floor(enemyBokemon.attack * (0.8 + Math.random() * 0.4));
      
      setMessage(`${enemyBokemon.name}の ${enemyMove}!`);
      playSound('move', enemyMove);
      
      setTimeout(() => {
        setAttackAnimation(null);
        playSound('damage');
        
        setPlayerBokemon(prev => {
          if (!prev) return null;
          const newPlayerHp = Math.max(0, prev.hp - enemyDamage);
          setMessage(`${enemyDamage}のダメージ!`);
          return { ...prev, hp: newPlayerHp };
        });
        
        // HP更新後の状態を正確に取得するため、useEffectまたは非同期処理のチェーンで扱う
        setTimeout(() => {
          setPlayerBokemon(prev => {
            if (!prev) return null;
            if (prev.hp === 0) {
              playSound('defeat');
              setMessage(`${prev.name}は倒れた...`);
              
              const nextIndex = playerTeam.findIndex((b, i) => i !== currentPlayerIndex && b.hp > 0);
              if (nextIndex !== -1) {
                setTimeout(() => switchBokemon(nextIndex, true), 2000); // 倒れた後の自動交代
              } else {
                setMessage('全てのボケモンが倒れた... 敗北...');
                setGameState('defeat');
                setIsAnimating(false);
              }
              return { ...prev, isFainted: true };
            } else {
              setIsAnimating(false);
              return prev;
            }
          });
        }, 1000);
      }, 800);
    }, 1500);
  };

  // isAutoSwitch: 倒れた後での自動交代か (ログメッセージを変えるため)
  const switchBokemon = (index: number, isAutoSwitch: boolean = false) => {
    if (isAnimating || (!isAutoSwitch && index === currentPlayerIndex)) return;
    
    const newBokemon = { ...playerTeam[index] };
    
    if (newBokemon.hp === 0) {
      setMessage('そのボケモンは倒れています!');
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    
    if (!isAutoSwitch) {
      setMessage(`もどれ! ${playerBokemon?.name}!`);
      playSound('switch');
    }
    
    setTimeout(() => {
      setPlayerBokemon(newBokemon);
      setCurrentPlayerIndex(index);
      setMessage(`行け! ${newBokemon.name}!`);
      playSound('heal'); // ボケモンを出す時の音
      setShowMoves(false);
      setShowSwitchMenu(false); // 交代メニューを閉じる
      
      // 敵の攻撃
      setTimeout(() => {
        enemyAttackTurn(); // 交代後も敵の攻撃は発生
      }, 1500);
    }, isAutoSwitch ? 0 : 1500); // 自動交代時はすぐに次のポケモンを出す
  };

  const reset = () => {
    setPlayerTeam([]);
    setPlayerBokemon(null);
    setEnemyBokemon(null);
    setGameState('teamSelection');
    setMessage('チームを選んでください! (3体まで)');
    setIsAnimating(false);
    setShowMoves(false);
    setEnemyDefeated(0);
    setCurrentPlayerIndex(0);
    setAttackAnimation(null);
    setShowSwitchMenu(false);
  };


  // プレイヤーのHPが0になった時の処理 (gameStateがbattleの時のみ)
  useEffect(() => {
    if (playerBokemon && playerBokemon.hp === 0 && gameState === 'battle') {
        setPlayerBokemon(prev => (prev ? { ...prev, isFainted: true } : null)); // 倒れたフラグを立てる
        const allFainted = playerTeam.every(b => b.hp === 0);
        if (allFainted) {
            playSound('defeat');
            setMessage('全てのボケモンが倒れた... 敗北...');
            setGameState('defeat');
            setIsAnimating(false);
        } else {
            // 自動交代を促すか、交代メニューを表示
            setMessage('次のポケモンを選んでください！');
            setShowSwitchMenu(true); // 交代メニューを表示
        }
    }
  }, [playerBokemon?.hp, playerTeam, gameState]);

  // 敵のHPが0になった時の処理
  useEffect(() => {
    if (enemyBokemon && enemyBokemon.hp === 0 && gameState === 'battle') {
        setEnemyBokemon(prev => (prev ? { ...prev, isFainted: true } : null));
        playSound('victory');
        setEnemyDefeated(prevCount => prevCount + 1);
        setMessage(`${enemyBokemon.name}を倒した!`);
        setGameState('victory'); // 勝利状態
        setIsAnimating(false);
    }
  }, [enemyBokemon?.hp, gameState]);


  const BokemonSprite: React.FC<{ bokemon: Bokemon; isEnemy: boolean; isAttacking: boolean | null }> = ({ bokemon, isEnemy, isAttacking }) => {
    const isFainted = bokemon.hp === 0;
    return (
      <div className={`relative transition-all duration-300 ${
        isAttacking === (isEnemy ? 'enemy' : 'player') ? (isEnemy ? 'translate-x-8' : '-translate-x-8') : ''
      }`}>
        <div className={`text-8xl ${isFainted ? 'opacity-30 grayscale' : ''}`}>
          {bokemon.emoji}
        </div>
        {isAttacking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-ping">💥</div>
          </div>
        )}
      </div>
    );
  };

  const BokemonCard: React.FC<{ bokemon: Bokemon; isEnemy: boolean; isSmall?: boolean }> = ({ bokemon, isSmall }) => {
    const Icon = bokemon.icon;
    const hpPercentage = (bokemon.hp / bokemon.maxHp) * 100;
    
    return (
      <div className={`${bokemon.bgColor} rounded-xl ${isSmall ? 'p-3' : 'p-4'} shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`${isSmall ? 'text-base' : 'text-xl'} font-bold`}>{bokemon.name}</h3>
          <Icon className={`${isSmall ? 'w-4 h-4' : 'w-6 h-6'} ${bokemon.color}`} />
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>HP</span>
            <span>{bokemon.hp} / {bokemon.maxHp}</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                hpPercentage > 50 ? 'bg-green-500' : 
                hpPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>
        {!isSmall && (
          <div className="flex items-center gap-2 text-xs">
            <span>タイプ: {bokemon.type}</span>
          </div>
        )}
      </div>
    );
  };


  // プレイヤーのHPが0になった時の処理
  useEffect(() => {
    if (playerBokemon && playerBokemon.hp === 0 && gameState === 'battle') {
        setPlayerBokemon(prev => (prev ? { ...prev, isFainted: true } : null)); // 倒れたフラグを立てる
        // playerTeamの状態も更新する
        setPlayerTeam(prevTeam => prevTeam.map((b, idx) => 
            idx === currentPlayerIndex ? { ...b, hp: 0, isFainted: true } : b
        ));

        const allFainted = playerTeam.every(b => b.hp === 0);
        if (allFainted) {
            playSound('defeat');
            setMessage('全てのボケモンが倒れた... 敗北...');
            setGameState('defeat');
            setIsAnimating(false);
        } else {
            setMessage('次のポケモンを選んでください！');
            setShowSwitchMenu(true); // 交代メニューを表示
        }
    }
  }, [playerBokemon?.hp, playerTeam, currentPlayerIndex, gameState]);

  // 敵のHPが0になった時の処理
  useEffect(() => {
    if (enemyBokemon && enemyBokemon.hp === 0 && gameState === 'battle') {
        setEnemyBokemon(prev => (prev ? { ...prev, isFainted: true } : null));
        playSound('victory');
        setEnemyDefeated(prevCount => prevCount + 1);
        setMessage(`${enemyBokemon.name}を倒した!`);
        setGameState('victory'); // 勝利状態
        setIsAnimating(false);
    }
  }, [enemyBokemon?.hp, gameState]);

  if (gameState === 'teamSelection') {
    return (
      <div 
        className="w-full max-w-6xl mx-auto p-6 rounded-xl min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #E0F6FF 0%, #B0E0E6 50%, #90EE90 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
        <h1 className="text-5xl font-bold text-center mb-4 text-blue-600" style={{fontFamily: 'monospace'}}>
          ボケモン 赤・緑
        </h1>
        <p className="text-center text-xl mb-6 bg-white rounded-lg p-3 shadow-md">{message}</p>
        
        {playerTeam.length > 0 && (
          <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
            <h3 className="font-bold text-lg mb-3">選択中のチーム:</h3>
            <div className="grid grid-cols-3 gap-4">
              {playerTeam.map(bokemon => (
                <div key={bokemon.id} className={`${bokemon.bgColor} p-4 rounded-lg relative`}>
                  <button
                    onClick={() => removeFromTeam(bokemon.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600"
                  >
                    ×
                  </button>
                  <div className="text-5xl text-center mb-2">{bokemon.emoji}</div>
                  <p className="text-center font-bold">{bokemon.name}</p>
                </div>
              ))}
            </div>
            {playerTeam.length === 3 && (
              <button
                onClick={startBattle}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-bold transition-colors shadow-lg"
              >
                バトル開始!
              </button>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bokemonData.map(bokemon => {
            const isSelected = playerTeam.find(b => b.id === bokemon.id);
            return (
              <button
                key={bokemon.id}
                onClick={() => selectTeamMember(bokemon)}
                disabled={isSelected}
                className={`${bokemon.bgColor} p-4 rounded-xl hover:scale-105 transition-transform shadow-lg ${
                  isSelected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="text-6xl text-center mb-2">{bokemon.emoji}</div>
                <h3 className="text-lg font-bold mb-1 text-center">{bokemon.name}</h3>
                <p className="text-xs text-gray-600 text-center">{bokemon.type}</p>
                <p className="text-xs text-gray-600 text-center">HP: {bokemon.maxHp}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-6xl mx-auto p-6 rounded-xl min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #E0F6FF 0%, #B0E0E6 50%, #90EE90 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-600" style={{fontFamily: 'monospace'}}>ボケモンバトル</h1>
        <div className="bg-white px-4 py-2 rounded-lg shadow-md">
          <p className="font-bold">倒した数: {enemyDefeated}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-white rounded-lg p-4 text-center shadow-md border-4 border-gray-800">
          <p className="text-lg font-bold" style={{fontFamily: 'monospace'}}>{message}</p>
        </div>
      </div>

      {/* バトルフィールド */}
      <div 
        className="rounded-xl p-8 mb-6 shadow-lg border-4 border-gray-800 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/battle-background-pattern.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '400px'
        }}
      >
        <div className="grid grid-cols-2 gap-8 items-end mb-6">
          <div className="text-right">
            {enemyBokemon && (
              <div>
                <div className="flex justify-end mb-4">
                  <BokemonSprite 
                    bokemon={enemyBokemon} 
                    isEnemy={true}
                    isAttacking={attackAnimation === 'enemy'}
                  />
                </div>
                <BokemonCard bokemon={enemyBokemon} isEnemy={true} />
              </div>
            )}
          </div>
          
          <div className="text-left">
            {playerBokemon && (
              <div>
                <div className="flex justify-start mb-4">
                  <BokemonSprite 
                    bokemon={playerBokemon} 
                    isEnemy={false}
                    isAttacking={attackAnimation === 'player'}
                  />
                </div>
                <BokemonCard bokemon={playerBokemon} isEnemy={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {gameState === 'battle' && !showMoves && !showSwitchMenu && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowMoves(true)}
                disabled={isAnimating}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg text-lg font-bold transition-colors shadow-lg border-4 border-red-800"
              >
                たたかう
              </button>
              <button
                onClick={() => setShowSwitchMenu(true)} // ポケモンボタンで交代メニュー表示
                disabled={isAnimating}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg text-lg font-bold transition-colors shadow-lg border-4 border-blue-800"
              >
                ポケモン
              </button>
            </div>
          )}

          {showMoves && playerBokemon && (
            <div className="bg-white rounded-lg p-4 shadow-lg border-4 border-gray-800">
              <h3 className="font-bold mb-3 text-lg">わざを選んでください</h3>
              <div className="grid grid-cols-2 gap-3">
                {playerBokemon.moves.map((move, index) => (
                  <button
                    key={index}
                    onClick={() => useMove(move)}
                    disabled={isAnimating}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-lg font-bold transition-colors shadow-md border-2 border-purple-800"
                  >
                    {move}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowMoves(false)}
                className="w-full mt-3 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold transition-colors border-2 border-gray-700"
              >
                もどる
              </button>
            </div>
          )}

          {showSwitchMenu && (
            <div className="bg-white rounded-lg p-4 shadow-lg border-4 border-gray-800">
              <h3 className="font-bold mb-3 text-lg">ポケモンを選んでください</h3>
              <div className="grid grid-cols-2 gap-3">
                {playerTeam.map((bokemon, index) => (
                  <button
                    key={bokemon.id}
                    onClick={() => switchBokemon(index)}
                    disabled={isAnimating || bokemon.hp === 0 || index === currentPlayerIndex}
                    className={`${bokemon.bgColor} p-3 rounded-lg font-bold transition-colors shadow-md border-2 ${
                        bokemon.hp === 0 ? 'opacity-50 cursor-not-allowed' : 
                        index === currentPlayerIndex ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    <div className="text-4xl text-center">{bokemon.emoji}</div>
                    <p className="text-sm">{bokemon.name}</p>
                    <p className="text-xs">HP: {bokemon.hp}/{bokemon.maxHp}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowSwitchMenu(false)}
                className="w-full mt-3 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold transition-colors border-2 border-gray-700"
              >
                もどる
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg border-4 border-gray-800">
          <h3 className="font-bold mb-3 text-lg">パーティ</h3>
          <div className="space-y-3">
            {playerTeam.map((bokemon, index) => (
              <div key={bokemon.id}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-3xl">{bokemon.emoji}</div>
                  <div className="flex-1">
                    <BokemonCard bokemon={bokemon} isSmall={true} />
                  </div>
                </div>
                {/* 交代ボタンは交代メニューで提供 */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {gameState === 'defeat' || gameState === 'victory' ? (
        <div className="text-center mt-6">
          <button
            onClick={reset}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-colors shadow-lg border-4 border-blue-800"
          >
            {gameState === 'defeat' ? '最初からやり直す' : '次の敵とバトル'}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default BokemonGame;