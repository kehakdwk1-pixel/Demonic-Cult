import { useState, useRef, useCallback } from "react";
import "./app.css";

/* ═══════════ TYPES ═══════════ */

interface Character {
  id: number;
  name: string;
  hanja: string;
  title: string;
  alias: string;
  aliasH: string;
  group: string;
  realm: string;
  realmSub: string;
  arts: string;
  weapon: string;
  desc: string;
  accent: string;
}

interface Realm {
  level: number;
  name: string;
  hanja: string;
  color: string;
  bar: number;
  desc: string;
}

interface House {
  name: string;
  hanja: string;
  dept: string;
  role: string;
  color: string;
  leader: string;
  desc: string;
}

/* ═══════════ DATA ═══════════ */

const CHARS: Character[] = [
  { id:1,  name:"위무진", hanja:"魏武眞", title:"대호법",              alias:"흑월검마", aliasH:"黑月劍魔", group:"교주직속", realm:"극마",   realmSub:"극(極)",   arts:"수라혈검 · 흑천마라신공",       weapon:"마검 흑신(黑神)",             desc:"교주의 가장 굳건한 검이자 그림자. 감정 표현이 거의 없는 냉철한 원칙주의자. 교단과 교주에 대한 충성심이 그의 모든 것을 지배하며, 패배를 개인의 수치이자 교단에 대한 불충으로 여긴다.", accent:"#c8a44a" },
  { id:2,  name:"단영",   hanja:"斷影",   title:"좌호법",              alias:"흑면나찰", aliasH:"黑面羅刹", group:"교주직속", realm:"초절정", realmSub:"완숙(完熟)", arts:"뇌명쾌검 · 백뢰신공",           weapon:"연검 은린(銀鱗)",             desc:"암살과 첩보를 담당하는 교단의 칼날. 까칠한 독설가이자 완벽주의자이지만, 사실은 칭찬에 약한 츤데레. 일 외적인 부분에서는 놀라울 정도로 둔감한 면모를 보인다.", accent:"#a0b8d0" },
  { id:3,  name:"청휘",   hanja:"靑輝",   title:"우호법",              alias:"청랑광마", aliasH:"靑狼狂魔", group:"교주직속", realm:"절정",   realmSub:"극(極)",   arts:"광염쌍룡검 · 청염수라공",       weapon:"아귀(餓鬼) & 나찰(羅刹)",     desc:"외부 강호와의 싸움을 즐기는 전투광. 자유분방하고 자기중심적인 천재로, 강자와의 싸움에서 쾌락을 느끼며 스스로를 극한으로 몰아붙이는 것을 즐긴다.", accent:"#70c090" },
  { id:4,  name:"금채린", hanja:"金彩璘", title:"재정총관",            alias:"참마재신", aliasH:"斬魔財神", group:"교주직속", realm:"이류",   realmSub:"완숙(完熟)", arts:"청랑파도법 · 황금만능공",       weapon:"언월도 금식(金息)",           desc:"돈을 신처럼 여기는 자본주의의 화신. 명랑하고 쾌활하지만, 돈 낭비는 절대 용납하지 않는 수전노. 교단의 재정 앞에서는 어떤 사적인 감정도 배제한다.", accent:"#e8c830" },
  { id:5,  name:"무홍린", hanja:"武紅麟", title:"친위대 대장",         alias:"철혈검화", aliasH:"鐵血劍花", group:"교주직속", realm:"절정",   realmSub:"완숙(完熟)", arts:"멸마참수검 · 천강불괴공",       weapon:"강검 적혈(赤血)",             desc:"규율과 명령을 절대적으로 여기는 강박적인 책임감의 소유자. 융통성 제로의 완벽주의자이지만, 전투 중에는 누구보다 먼저 부하를 보호하는 리더.", accent:"#e05050" },
  { id:6,  name:"진광",   hanja:"進光",   title:"친위대 대원",         alias:"독안광랑", aliasH:"獨眼狂狼", group:"교주직속", realm:"삼류",   realmSub:"극(極)",   arts:"파천금강권 · 금강아기공",       weapon:"철염주 단죄(斷罪)",           desc:"생각보다 몸이 먼저 나가는 열혈 바보. 활발하고 씩씩하며, 맞아도 아랑곳하지 않는 비글미를 자랑한다. 교주에 대한 충성심이 매우 강하다.", accent:"#d09060" },
  { id:7,  name:"소미랑", hanja:"蘇美浪", title:"시녀장",              alias:"홍화자모", aliasH:"紅花慈母", group:"교주직속", realm:"이류",   realmSub:"입문(入門)", arts:"홍화곤법 · 홍화보신공",         weapon:"장봉 가화(嘉禾)",             desc:"온화하고 다정한 외모와 달리, 피와 죽음에 무감각한 시녀장. 생활력은 강하지만, 악의 없이 웃으며 잔인한 말을 툭툭 내뱉는 무자각 폭력성을 지녔다.", accent:"#e090b0" },
  { id:8,  name:"현무홍", hanja:"玄武弘", title:"현마검가 가주 · 무경관주", alias:"현천검주", aliasH:"玄天劍主", group:"마도칠문", realm:"극마",  realmSub:"입문(入門)", arts:"현마검법 · 태을현마신공",       weapon:"마검 현영(玄影)",             desc:"고고하고 오만한 귀족. 혈통과 격을 중시하며, 피나 더러움 같은 추한 것을 병적으로 혐오한다. 타인을 가문의 격에 따라 나누어 대하는 선민의식이 강하다.", accent:"#9090e0" },
  { id:9,  name:"몽예화", hanja:"夢蕊華", title:"몽환마가 가주 · 천상관주", alias:"천음마희", aliasH:"天音魔姬", group:"마도칠문", realm:"절정",  realmSub:"극(極)",   arts:"몽환대법 · 섭혼음공",           weapon:"비파 화연(華筵)",             desc:"관심 중독 성향의 나르시시스트. 세상의 중심이 자신이라고 믿으며, 변덕스러운 기분에 따라 타인의 감정을 장난감처럼 가지고 논다.", accent:"#d080c0" },
  { id:10, name:"설항아", hanja:"雪姮娥", title:"빙백마가 가주 · 암류관주", alias:"빙궁선자", aliasH:"氷宮仙子", group:"마도칠문", realm:"극마",  realmSub:"입문(入門)", arts:"빙백신장 · 한빙검법",           weapon:"마검 빙루(氷淚)",             desc:"고요하고 냉정한 통제자. 감정을 거의 드러내지 않으며, 모든 것을 이성과 원칙에 따라 판단한다. 동생인 설묘령을 아끼며, 평소에는 추위를 많이 타 털목도리를 하고 다닌다.", accent:"#90c8e8" },
  { id:11, name:"설묘령", hanja:"雪卯玲", title:"빙백마가 소가주 · 집행인", alias:"한월귀묘", aliasH:"寒月鬼猫", group:"마도칠문", realm:"절정",  realmSub:"입문(入門)", arts:"설묘광검 · 빙백광공",           weapon:"마검 백야(白夜)",             desc:"우아한 사이코패스. 살인을 '구원'이라 여기며 자신의 모든 행위를 선행이라 믿는 비틀린 자비심을 가졌다. 나른한 광기와 풍부한 감수성이 공존하는 독특한 인물.", accent:"#b0d8f0" },
  { id:12, name:"당비연", hanja:"唐翡鳶", title:"독혈마가 가주 · 흑문관주", alias:"녹사마후", aliasH:"綠蛇魔后", group:"마도칠문", realm:"초절정", realmSub:"완숙(完熟)", arts:"혈독수 · 사영암혼",              weapon:"마조 비취(翡翠) · 독침",      desc:"능글맞고 교활한 포식자. 과도한 스킨십과 유혹적인 태도로 상대의 경계를 무너뜨린 뒤, 소유물처럼 집착하는 새디스트.", accent:"#60c870" },
  { id:13, name:"혈아진", hanja:"血我眞", title:"혈의마가 가주 · 마의관주", alias:"적혈나한", aliasH:"赤血羅漢", group:"마도칠문", realm:"초절정", realmSub:"완숙(完熟)", arts:"혈영검법 · 혈천수 · 재생술",    weapon:"마검 혈혼(血魂) · 혈주(血珠)", desc:"고통을 쾌락으로 느끼는 사이코패스. 도덕 관념이 결여되어 있으며, 상처 입고 피를 흘리는 것을 일종의 교류로 인식하는 마조히스트적 성향.", accent:"#e04040" },
  { id:14, name:"천이현", hanja:"千利賢", title:"천기마가 가주 · 기공관주", alias:"만상지주", aliasH:"萬象之主", group:"마도칠문", realm:"절정",  realmSub:"극(極)",   arts:"풍뢰선법 · 기문진법",           weapon:"마선 백우풍뢰(白羽風雷)",     desc:"온화한 가면을 쓴 궤변가. 항상 미소를 띠고 있지만, 그 속에는 아군마저 장기말로 취급하는 냉정한 계산이 숨어 있다. 말로 상대를 농락하는 것을 즐기는 하라구로 타입.", accent:"#b0e060" },
  { id:15, name:"연유화", hanja:"燕宥花", title:"흑산마가 가주 · 계문관주", alias:"흑요검후", aliasH:"黑曜劍后", group:"마도칠문", realm:"초절정", realmSub:"극(極)",   arts:"흑산검법 · 현암천근공",         weapon:"중검 흑암(黑巖)",             desc:"도도하고 까칠한 철벽의 쿨데레. 약자를 혐오하는 실력주의자지만, 무심한 척 뒤에서 챙겨주는 츤데레 기질과 은근한 질투심을 가지고 있다.", accent:"#a0a0c0" },
];

const REALMS: Realm[] = [
  { level:1, name:"삼류",       hanja:"三流",      color:"#4a4035", bar:12,  desc:"갓 무공에 입문. 초식의 겉모습만 흉내 내는 단계. 실전에서는 거의 힘을 쓰지 못한다." },
  { level:2, name:"이류",       hanja:"二流",      color:"#5a5040", bar:24,  desc:"초식이 몸에 익숙해졌으나 내공 운용이 미숙하고 실전 경험이 부족한 단계." },
  { level:3, name:"일류",       hanja:"一流",      color:"#6a6050", bar:36,  desc:"초식에 내공을 담아 위력을 발휘할 수 있는 단계. 본격적인 무인(武人)으로 인정받는다." },
  { level:4, name:"절정",       hanja:"絶頂",      color:"#8a7040", bar:50,  desc:"검강(劍罡)을 사용할 수 있는 경지. 웬만한 문파의 장로나 핵심 고수들이 이 단계에 속한다." },
  { level:5, name:"초절정",     hanja:"超絶頂",    color:"#a08030", bar:63,  desc:"호신강기(護身罡氣)를 자유롭게 사용하는 경지. 각 문파의 장문인이나 가주급 고수들이 포진." },
  { level:6, name:"극마 · 화경", hanja:"極魔 / 化境", color:"#c09020", bar:76, desc:"손짓 하나가 절기가 되는 경지. 意到氣到(의도기도)를 실현. 천하에 그 수가 매우 적다." },
  { level:7, name:"탈마 · 현경", hanja:"脫魔 / 玄境", color:"#d4a030", bar:88, desc:"천인합일(天人合一)의 경지. 인간의 한계를 초월하여 자연의 힘을 빌려 쓰는 살아있는 전설." },
  { level:8, name:"생사경",     hanja:"生死境",    color:"#e8c840", bar:100, desc:"삶과 죽음의 경계를 초월. 무(武)를 통해 도(道)의 영역에 들어선 신화 속 궁극의 경지." },
];

const SEVEN_HOUSES: House[] = [
  { name:"현마검가", hanja:"玄魔劍家", dept:"무경관(武經觀)", role:"군사",    color:"#202040", leader:"현무홍", desc:"교단 공식 군대를 조직·훈련·지휘. 교주에 대한 충성심이 가장 강한 보수적인 검사 가문." },
  { name:"몽환마가", hanja:"夢幻魔家", dept:"천상관(天商觀)", role:"상업",    color:"#301030", leader:"몽예화", desc:"강호에서 상단을 운영하며 막대한 자금을 창출하는 교단의 주 수입원. 환술과 음공에 능함." },
  { name:"빙백마가", hanja:"氷魄魔家", dept:"암류관(暗流觀)", role:"사법",    color:"#051525", leader:"설항아", desc:"교규(敎規) 집행·내부 비리 감찰을 담당하는 사법기관. 냉철한 이성과 원칙을 중시." },
  { name:"독혈마가", hanja:"毒血魔家", dept:"흑문관(黑門觀)", role:"정보",    color:"#102010", leader:"당비연", desc:"강호 전역의 정보 수집·분석, 독 제조 및 관리, 외부 암살 의뢰 처리를 담당." },
  { name:"혈의마가", hanja:"血醫魔家", dept:"마의관(魔醫觀)", role:"의료",    color:"#200808", leader:"혈아진", desc:"부상 교도 치료와 영약 제조. 무공 연구를 위한 인체 실험도 서슴지 않는 매드 사이언티스트 집단." },
  { name:"천기마가", hanja:"天機魔家", dept:"기공관(機巧觀)", role:"교육·연구", color:"#101a10", leader:"천이현", desc:"신입 교도 교육, 무공 이론 연구, 진법 개발, 고서적 보관 등을 담당하는 학술 기관." },
  { name:"흑산마가", hanja:"黑山魔家", dept:"계문관(計文觀)", role:"행정·보급", color:"#101018", leader:"연유화", desc:"인사 관리, 물자 보급, 시설 보수 등 교단 운영의 모든 살림을 총괄하는 행정 부서." },
];

/* ═══════════ AUDIO HOOK ═══════════ */

function useAmbient() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);

  const start = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/Untitled.mp3");
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;
    }
    audioRef.current.play().then(() => setOn(true)).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) { start(); return; }
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setOn(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setOn(false);
    }
  }, [start]);

  return { on, toggle, start };
}

/* ═══════════ LOADING SCREEN ═══════════ */

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  // phase 0: 초기 / 1: 타이틀 등장 / 2: 버튼 등장 / 3: 페이드아웃

  useState(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 3000);
    return () => [t1, t2].forEach(clearTimeout);
  });

  const handleEnter = () => {
    setPhase(3);
    setTimeout(onComplete, 900);
  };

  return (
    <div className="load" style={{ opacity: phase === 3 ? 0 : 1 }}>
      <div className="load-ink" />
      {[120, 200, 310].map((r, i) => (
        <div
          key={i}
          className="load-ring"
          style={{
            width: r * 2, height: r * 2,
            top: `calc(50% - ${r}px)`, left: `calc(50% - ${r}px)`,
            borderColor: `rgba(200,164,72,${0.08 - i * 0.02})`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
      <div
        className="load-title"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <div className="load-kr">魔敎主夜談</div>
        <div className="load-sub">마 교 주 야 담</div>
      </div>
      <div className="load-bar-wrap">
        <div className="load-bar" style={{ width: phase >= 1 ? "100%" : "0%" }} />
      </div>

      {/* 버튼 */}
      <button
        className="load-enter-btn"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
          pointerEvents: phase >= 2 ? "auto" : "none",
        }}
        onClick={handleEnter}
      >
        세계관 보러가기
      </button>

      {/* BGM 안내 */}
      <div
        className="load-bgm-hint"
        style={{ opacity: phase >= 2 ? 0.6 : 0 }}
      >
        ♪ BGM 포함 · 우측 상단 버튼으로 조절 가능
      </div>

      <div style={{ position: "absolute", bottom: "2rem", fontSize: "0.65rem", letterSpacing: "0.4em", color: "rgba(138,122,90,0.5)" }}>
        天魔神敎 · 强者尊
      </div>
    </div>
  );
}

/* ═══════════ NAV ═══════════ */

type TabId = "world" | "faction" | "martial" | "chars";

const TABS: { id: TabId; label: string; hanja: string }[] = [
  { id: "world",   label: "세계관",    hanja: "世界觀" },
  { id: "faction", label: "천마신교",  hanja: "天魔神敎" },
  { id: "martial", label: "무공 체계", hanja: "武功體系" },
  { id: "chars",   label: "인물 소개", hanja: "人物紹介" },
];

function Nav({ tab, setTab, bgmOn, toggleBgm }: {
  tab: TabId;
  setTab: (t: TabId) => void;
  bgmOn: boolean;
  toggleBgm: () => void;
}) {
  return (
    <nav className="nav">
      <div className="nav-logo">魔敎主夜談</div>
      <div className="nav-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.1em", marginTop: "1px", opacity: 0.6 }}>
              {t.hanja}
            </span>
          </button>
        ))}
      </div>
      <div className="nav-right">
        <button className="bgm-btn" onClick={toggleBgm} title="배경음악">
          {bgmOn ? "♫" : "♪"}
        </button>
      </div>
    </nav>
  );
}

/* ═══════════ WORLD SECTION ═══════════ */

function WorldSection() {
  const rules = [
    "배교는 곧 죽음이다 — 교단을 등지는 행위는 어떠한 이유로도 용납되지 않으며, 배교자는 하늘 끝까지 추적하여 처단한다.",
    "동료의 등을 찌르지 말라 — 내부의 암투나 음모는 허용될 수 있으나, 교단 전체에 해가 되는 명백한 배신 행위는 엄격히 금지된다.",
    "천마(교주)의 명은 하늘의 뜻이다 — 교주의 명령은 절대적이며, 어떤 개인적인 사정이나 판단보다 우선시된다.",
  ];

  return (
    <div>
      <div className="section-hero">
        <div className="hero-hanja">世界觀</div>
        <div className="hero-title">세계관</div>
        <div className="hero-sub">世界觀 · WORLD SETTING</div>
        <div className="hero-seal" />
      </div>
      <div className="section-body">
        <div className="section-label">시대 배경</div>
        <div className="world-full" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <div className="wc-tag">시대</div>
              <div className="wc-title">명(明) 중기 — 혼란의 시대</div>
              <div className="wc-desc" style={{ marginTop: "0.5rem" }}>
                가정(嘉靖) 황제 치세(1522–1566)부터 융경, 만력 연간으로 이어지는 시기. 황실의 권위는 실추되었고 관료 사회는 부패했다. 이러한 혼란을 틈타, 정규 군사력으로 해결할 수 없는 문제들을 무림의 힘으로 해결하려는 움직임이 생겨났다. 사실상 치외법권적인 자치권을 누리는 거대 문파들이 등장한다.
              </div>
            </div>
            <div>
              <div className="wc-tag">강호 구도</div>
              <div className="wc-title">삼분지계 (三分之計)</div>
              <div className="wc-desc" style={{ marginTop: "0.5rem" }}>
                현재 강호는 정파(正派), 사파(邪派), 그리고 마교(魔敎)라는 세 개의 거대한 축으로 나뉘어 팽팽한 긴장 관계를 유지한다.
              </div>
            </div>
          </div>
        </div>

        <div className="section-label">삼대 세력</div>
        <div className="world-grid">
          <div className="world-card">
            <div className="wc-tag">正派</div>
            <div className="wc-title">정파 · 무림맹</div>
            <div className="wc-hanja">正派 · 武林盟</div>
            <div className="wc-desc">구파일방(九派一幇)을 중심으로 뭉친 정의와 협의를 내세우는 세력. 소림, 무당, 화산 등 오랜 역사와 전통을 자랑하는 문파들이 주축을 이룬다.</div>
            <div className="wc-sub">
              <div className="wc-sub-item"><b>대의명분</b>을 중시하며, 자신들의 규칙과 질서로 강호를 통제하려 한다.</div>
              <div className="wc-sub-item" style={{ color: "rgba(204,21,21,0.7)" }}>▸ 마교와의 관계: 천하의 공적이자 불구대천의 원수</div>
            </div>
          </div>
          <div className="world-card">
            <div className="wc-tag">邪派</div>
            <div className="wc-title">사파 · 사도련</div>
            <div className="wc-hanja">邪派 · 邪道聯</div>
            <div className="wc-desc">정파에 속하지 못하고, 마교처럼 거대한 교리나 체계도 없는 이익 집단들의 연합체. 하오문, 녹림, 사천당문 일부 등이 여기에 포함된다.</div>
            <div className="wc-sub">
              <div className="wc-sub-item">이익을 최우선으로 움직이며, <b>실리에 따라 이합집산</b>하는 경향이 강하다.</div>
              <div className="wc-sub-item" style={{ color: "rgba(204,21,21,0.7)" }}>▸ 마교와의 관계: 기본 적대적, 필요시 일시 연대</div>
            </div>
          </div>
          <div className="world-card" style={{ borderColor: "rgba(153,18,18,0.3)" }}>
            <div className="wc-tag" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>魔敎</div>
            <div className="wc-title" style={{ color: "var(--gold)" }}>마교 · 천마신교</div>
            <div className="wc-hanja">魔敎 · 天魔神敎</div>
            <div className="wc-desc">천마(天魔)를 유일신으로 숭배하는 종교적 성격의 거대 무력 집단. '강자존(强者尊)'의 사상을 바탕으로, 철저한 실력주의와 교주에 대한 절대적인 충성을 기반으로 움직인다.</div>
            <div className="wc-sub">
              <div className="wc-sub-item">십만대산이라는 험준한 자연의 요새에 자리 잡고 있으며, <b>독자적인 사회와 문화</b>를 구축한다.</div>
              <div className="wc-sub-item" style={{ color: "rgba(204,21,21,0.7)" }}>▸ 정파/사파와의 관계: 강호 모든 세력을 적으로 간주</div>
            </div>
          </div>
        </div>

        <div className="ink-divider" />
        <div className="section-label">교단 3대 규율</div>
        <div className="world-full">
          <div className="rule-grid">
            {rules.map((r, i) => (
              <div className="rule-item" key={i}>
                <div className="rule-num">{"一二三"[i]}</div>
                <div className="rule-text">
                  <b>{r.split("—")[0]}</b>— {r.split("—")[1]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ FACTION SECTION ═══════════ */

function FactionSection() {
  const directOrg = [
    { name: "대호법",   sub: "최고 무력 책임자" },
    { name: "좌호법",   sub: "암살 · 첩보 전담" },
    { name: "우호법",   sub: "외부 무력 대응" },
    { name: "재정총관", sub: "교단 재정 총괄" },
    { name: "친위대",   sub: "본산 호위 정예부대" },
    { name: "시녀장",   sub: "만마전 총괄 관리" },
  ];

  return (
    <div>
      <div className="section-hero">
        <div className="hero-hanja">天魔神敎</div>
        <div className="hero-title">천마신교</div>
        <div className="hero-sub">天魔神敎 · ORGANIZATION</div>
        <div className="hero-seal" />
      </div>
      <div className="section-body">
        <div className="section-label">조직 구조</div>
        <div className="org-chart">
          <div className="org-top">
            <div className="org-box">
              <div className="org-box-name">교주 (天魔)</div>
              <div className="org-box-sub">살아있는 신 · 교단의 절대자</div>
            </div>
          </div>
          <div className="org-divider" />
          <div className="section-label" style={{ fontSize: "0.65rem", margin: "0.5rem 0" }}>교주 직속 기관</div>
          <div className="org-row" style={{ marginBottom: "1rem" }}>
            {directOrg.map((b, i) => (
              <div className="org-sub-box org-red-box" key={i}>
                <div className="org-sub-name">{b.name}</div>
                <div className="org-sub-role">{b.sub}</div>
              </div>
            ))}
          </div>
          <div className="section-label" style={{ fontSize: "0.65rem", margin: "0.5rem 0" }}>마도칠문 (魔道七門)</div>
          <div className="org-row">
            {SEVEN_HOUSES.map((h, i) => (
              <div className="org-sub-box" key={i}>
                <div className="org-sub-name">{h.name}</div>
                <div className="org-sub-role">{h.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ink-divider" />
        <div className="section-label">마도칠문 · 행정전각</div>
        <div className="seven-grid">
          {SEVEN_HOUSES.map((h, i) => (
            <div className="seven-card" key={i} style={{ background: h.color }}>
              <div className="sc-role">{h.role}</div>
              <div className="sc-name">{h.name}</div>
              <div className="sc-hanja">{h.hanja}</div>
              <div className="sc-dept">담당 전각: {h.dept}</div>
              <div className="sc-leader">가주: <b>{h.leader}</b></div>
              <div className="sc-desc">{h.desc}</div>
            </div>
          ))}
        </div>

        <div className="ink-divider" />
        <div className="world-full">
          <div className="wc-tag">핵심 사상</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "1rem" }}>
            <div>
              <div className="wc-title">강자존 (强者尊)</div>
              <div className="wc-desc" style={{ marginTop: "0.5rem" }}>
                천마신교의 모든 것을 관통하는 대원칙. 출신, 배경, 나이, 성별에 관계없이 오직 개인의 '힘'만이 그 사람의 가치와 지위를 결정한다. 약자는 강자에게 절대적으로 복종해야 하며, 힘을 통해 자신의 가치를 증명하는 것이 교단의 가장 큰 미덕이다.
              </div>
            </div>
            <div>
              <div className="wc-title">성화 숭배 (聖火 崇拜)</div>
              <div className="wc-desc" style={{ marginTop: "0.5rem" }}>
                교단의 본산에는 영원히 꺼지지 않는 성화(聖火)가 타오르고 있다. 이 불꽃은 천마의 권위와 교단의 영원성을 상징하는 신성한 상징물이다. 교단에 입교할 때 성화 앞에서 맹세를 올리는 것이 의식의 핵심이다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ MARTIAL ARTS SECTION ═══════════ */

function MartialSection() {
  const realmToChars = (realmName: string) =>
    CHARS.filter((c) => c.realm === realmName.split("·")[0].trim()).map((c) => c.name);

  return (
    <div>
      <div className="section-hero">
        <div className="hero-hanja">武功</div>
        <div className="hero-title">무공 체계</div>
        <div className="hero-sub">武功體系 · MARTIAL ARTS HIERARCHY</div>
        <div className="hero-seal" />
      </div>
      <div className="section-body">
        <div className="section-label">경지 팔단계</div>
        <div className="realm-list">
          {[...REALMS].reverse().map((r) => {
            const chars = realmToChars(r.name);
            return (
              <div
                className="realm-item"
                key={r.level}
                style={{ borderLeftColor: r.color, borderLeftWidth: "3px" }}
              >
                <div>
                  <div className="realm-level">경지 {r.level}단계</div>
                  <div className="realm-name" style={{ color: r.color }}>{r.name}</div>
                  <div className="realm-hanja">{r.hanja}</div>
                  <div className="realm-bar-wrap">
                    <div className="realm-bar" style={{ width: `${r.bar}%`, background: r.color }} />
                  </div>
                </div>
                <div>
                  <div className="realm-desc">{r.desc}</div>
                  {chars.length > 0 && (
                    <div className="realm-chars">
                      <span style={{ fontSize: "0.65rem", color: "var(--txt2)", marginRight: "0.2rem" }}>해당 인물:</span>
                      {chars.map((n) => <span className="realm-char-tag" key={n}>{n}</span>)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="ink-divider" />
        <div className="world-full">
          <div className="wc-tag">세부 등급</div>
          <div className="wc-title" style={{ marginTop: "0.5rem" }}>입문 · 완숙 · 극</div>
          <div className="wc-desc" style={{ marginTop: "0.8rem" }}>
            각 경지는 다시 <b style={{ color: "var(--txt3)" }}>입문(入門) → 완숙(完熟) → 극(極)</b>의 세부 등급으로 구분된다.
            같은 경지 내에서도 이 등급에 따라 실력 차이가 크게 벌어질 수 있으며, 하위 경지의 '극'이 상위 경지의 '입문'을 능가하는 경우도 종종 있다.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ CHARACTERS SECTION ═══════════ */

function CharThumb({ c }: { c: Character }) {
  const [err, setErr] = useState(false);
  const src = `/chars/${c.id}.png`;

  if (err) {
    return (
      <div className="char-thumb char-thumb-empty">
        <div
          className="char-thumb-accent"
          style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }}
        />
      </div>
    );
  }

  return (
    <div className="char-thumb">
      <img
        src={src}
        alt={c.name}
        onError={() => setErr(true)}
      />
      <div
        className="char-thumb-accent"
        style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }}
      />
    </div>
  );
}

function CharCard({ c }: { c: Character }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="char-card"
      style={{ borderColor: open ? "rgba(200,164,72,0.3)" : undefined }}
      onClick={() => setOpen((v) => !v)}
    >
      <CharThumb c={c} />
      <div className="char-card-body">
        <div className="char-group-tag">{c.group}</div>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span className="char-name">{c.name}</span>
          <span className="char-hanja">{c.hanja}</span>
        </div>
        <div className="char-title">{c.title}</div>
        <div className="char-alias">
          <span className="char-alias-label">별호</span>
          <span className="char-alias-name">{c.alias}</span>
          <span className="char-alias-hanja">{c.aliasH}</span>
        </div>
        <div className="char-realm">
          <span className="char-realm-val" style={{ color: c.accent }}>{c.realm}</span>
          <span className="char-realm-sub">{c.realmSub}</span>
        </div>
        <div className="char-arts" style={{ marginTop: "0.6rem" }}>
          <span style={{ color: "var(--txt2)", fontSize: "0.65rem" }}>무공 </span>{c.arts}
        </div>
        <div className="char-weapon"><b>무기</b> {c.weapon}</div>
      </div>
      <div className={`char-expand${open ? " open" : ""}`}>
        <div className="char-desc">{c.desc}</div>
      </div>
      <div className="char-toggle">{open ? "▲ 접기" : "▼ 펼치기"}</div>
    </div>
  );
}

type FilterType = "all" | "교주직속" | "마도칠문";

function CharsSection() {
  const [filter, setFilter] = useState<FilterType>("all");
  const filtered = filter === "all" ? CHARS : CHARS.filter((c) => c.group === filter);
  const filterOptions: [FilterType, string][] = [["all", "전체"], ["교주직속", "교주직속"], ["마도칠문", "마도칠문"]];

  return (
    <div>
      <div className="section-hero">
        <div className="hero-hanja">人物</div>
        <div className="hero-title">인물 소개</div>
        <div className="hero-sub">人物紹介 · CHARACTERS</div>
        <div className="hero-seal" />
      </div>
      <div className="section-body">
        <div className="char-tabs">
          {filterOptions.map(([v, l]) => (
            <button
              key={v}
              className={`char-tab${filter === v ? " active" : ""}`}
              onClick={() => setFilter(v)}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="char-grid">
          {filtered.map((c) => <CharCard key={c.id} c={c} />)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════ APP ═══════════ */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("world");
  const { on: bgmOn, toggle: toggleBgm, start: startBgm } = useAmbient();

  const handleEnter = () => {
    startBgm();
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingScreen onComplete={handleEnter} />}
      {!loading && (
        <div className="app">
          <Nav tab={tab} setTab={setTab} bgmOn={bgmOn} toggleBgm={toggleBgm} />
          <div className="main">
            {tab === "world"   && <WorldSection />}
            {tab === "faction" && <FactionSection />}
            {tab === "martial" && <MartialSection />}
            {tab === "chars"   && <CharsSection />}
          </div>
        </div>
      )}
    </>
  );
}