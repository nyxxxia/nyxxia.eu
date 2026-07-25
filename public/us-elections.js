(() => {
  'use strict';

  const LS_KEY = 'us_election_lab_simple_v2';
  const TOTAL_POPULAR_VOTES = 158000000;
  const HOUSE_SEATS = 435;
  const SENATE_SEATS = 100;
  const STRONGHOLD_BOOST = 7;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const SMALL_STATE_INSET = ['NH', 'VT', 'CT', 'NJ', 'MA', 'DE', 'RI', 'MD', 'DC'];

  const STATE_META = [
    ['AL','Alabama',9,15,55], ['AK','Alaska',3,8,54], ['AZ','Arizona',11,0,78], ['AR','Arkansas',6,16,49],
    ['CA','California',54,-13,82], ['CO','Colorado',10,-7,76], ['CT','Connecticut',7,-7,83], ['DE','Delaware',3,-7,78],
    ['DC','District of Columbia',3,-43,100], ['FL','Florida',30,3,82], ['GA','Georgia',16,0,68], ['HI','Hawaii',4,-15,80],
    ['ID','Idaho',4,19,47], ['IL','Illinois',19,-13,73], ['IN','Indiana',11,9,59], ['IA','Iowa',6,6,57],
    ['KS','Kansas',6,10,55], ['KY','Kentucky',8,16,48], ['LA','Louisiana',8,12,60], ['ME','Maine',4,-2,39],
    ['MD','Maryland',10,-16,84], ['MA','Massachusetts',11,-15,88], ['MI','Michigan',15,-1,66], ['MN','Minnesota',10,-3,69],
    ['MS','Mississippi',6,11,48], ['MO','Missouri',10,10,59], ['MT','Montana',4,11,44], ['NE','Nebraska',5,14,55],
    ['NV','Nevada',6,1,78], ['NH','New Hampshire',4,-1,55], ['NJ','New Jersey',14,-9,86], ['NM','New Mexico',5,-7,61],
    ['NY','New York',28,-12,82], ['NC','North Carolina',16,1,66], ['ND','North Dakota',3,20,44], ['OH','Ohio',17,6,62],
    ['OK','Oklahoma',7,20,58], ['OR','Oregon',8,-9,72], ['PA','Pennsylvania',19,0,67], ['RI','Rhode Island',4,-12,89],
    ['SC','South Carolina',9,8,58], ['SD','South Dakota',3,16,45], ['TN','Tennessee',11,14,61], ['TX','Texas',40,5,75],
    ['UT','Utah',6,13,72], ['VT','Vermont',3,-16,42], ['VA','Virginia',13,-4,72], ['WA','Washington',12,-12,75],
    ['WV','West Virginia',4,22,39], ['WI','Wisconsin',10,0,60], ['WY','Wyoming',3,25,36],
  ].map(([abbr, name, ev, lean, urban]) => ({ abbr, name, ev, lean, urban }));

  const SPLIT_EV = {
    ME: [
      { label:'ME statewide', ev:2, lean:0 },
      { label:'ME-1', ev:1, lean:-9 },
      { label:'ME-2', ev:1, lean:8 },
    ],
    NE: [
      { label:'NE statewide', ev:2, lean:0 },
      { label:'NE-1', ev:1, lean:8 },
      { label:'NE-2', ev:1, lean:-4 },
      { label:'NE-3', ev:1, lean:25 },
    ],
  };

  // 119th Congress baseline. The fourth value is the current race margin:
  // negative = Dem-caucus favored, positive = GOP favored. Optional candidate names let competitive races
  // show the winning candidate instead of treating the seat holder as both sides.
  const SENATE_DELEGATIONS = {
    AL:[['Tommy Tuberville',2,'right',20.4],['Katie Britt',3,'right',35.8]],
    AK:[['Dan Sullivan',2,'right',-3.9,{ dem:'Mary Peltola', rep:'Dan Sullivan' }],['Lisa Murkowski',3,'right',7.4]],
    AZ:[['Ruben Gallego',1,'left',-2.4],['Mark Kelly',3,'left',-4.9]],
    AR:[['Tom Cotton',2,'right',33.0],['John Boozman',3,'right',34.7]],
    CA:[['Adam Schiff',1,'left',-17.5],['Alex Padilla',3,'left',-22.2]],
    CO:[['John Hickenlooper',2,'left',-9.3],['Michael Bennet',3,'left',-14.6]],
    CT:[['Chris Murphy',1,'left',-20.1],['Richard Blumenthal',3,'left',-15.2]],
    DE:[['Lisa Blunt Rochester',1,'left',-13.0],['Chris Coons',2,'left',-21.5]],
    FL:[['Rick Scott',1,'right',12.8],['Ashley Moody',3,'right',16.4]],
    GA:[['Jon Ossoff',2,'left',-1.2],['Raphael Warnock',3,'left',-2.8]],
    HI:[['Mazie Hirono',1,'left',-35.8],['Brian Schatz',3,'left',-44.0]],
    ID:[['Jim Risch',2,'right',25.2],['Mike Crapo',3,'right',32.6]],
    IL:[['Dick Durbin',2,'left',-16.6],['Tammy Duckworth',3,'left',-14.3]],
    IN:[['Jim Banks',1,'right',19.1],['Todd Young',3,'right',20.9]],
    IA:[['Ashley Hinson',2,'right',2.0,{ dem:'Josh Turek', rep:'Ashley Hinson' }],['Chuck Grassley',3,'right',12.2]],
    KS:[['Roger Marshall',2,'right',11.4],['Jerry Moran',3,'right',23.0]],
    KY:[['Mitch McConnell',2,'right',19.6],['Rand Paul',3,'right',23.2]],
    LA:[['Bill Cassidy',2,'right',40.0],['John Kennedy',3,'right',43.7]],
    ME:[['Angus King',1,'left',-17.0],['Susan Collins',2,'right',8.6]],
    MD:[['Angela Alsobrooks',1,'left',-10.4],['Chris Van Hollen',3,'left',-31.0]],
    MA:[['Elizabeth Warren',1,'left',-19.2],['Ed Markey',2,'left',-33.4]],
    MI:[['Elissa Slotkin',1,'left',-0.3],['Gary Peters',2,'left',-1.7]],
    MN:[['Amy Klobuchar',1,'left',-16.0],['Tina Smith',2,'left',-5.2]],
    MS:[['Roger Wicker',1,'right',24.7],['Cindy Hyde-Smith',2,'right',10.0]],
    MO:[['Josh Hawley',1,'right',13.8],['Eric Schmitt',3,'right',13.2]],
    MT:[['Tim Sheehy',1,'right',7.1],['Steve Daines',2,'right',10.0]],
    NE:[['Deb Fischer',1,'right',6.7],['Pete Ricketts',2,'right',25.3]],
    NV:[['Jacky Rosen',1,'left',-1.6],['Catherine Cortez Masto',3,'left',-0.8]],
    NH:[['Jeanne Shaheen',2,'left',-15.6],['Maggie Hassan',3,'left',-9.2]],
    NJ:[['Andy Kim',1,'left',-9.6],['Cory Booker',2,'left',-16.3]],
    NM:[['Martin Heinrich',1,'left',-10.4],['Ben Ray Lujan',2,'left',-6.1]],
    NY:[['Kirsten Gillibrand',1,'left',-15.5],['Chuck Schumer',3,'left',-13.9]],
    NC:[['Michael Whatley',2,'right',-8.7,{ dem:'Roy Cooper', rep:'Michael Whatley' }],['Ted Budd',3,'right',3.2]],
    ND:[['Kevin Cramer',1,'right',37.1],['John Hoeven',3,'right',25.4]],
    OH:[['Bernie Moreno',1,'right',3.6],['Jon Husted',3,'right',-3.7,{ dem:'Sherrod Brown', rep:'Jon Husted' }]],
    OK:[['Alan Armstrong',2,'right',26.6],['James Lankford',3,'right',32.1]],
    OR:[['Jeff Merkley',2,'left',-17.0],['Ron Wyden',3,'left',-15.2]],
    PA:[['David McCormick',1,'right',0.2],['John Fetterman',3,'left',-4.9]],
    RI:[['Sheldon Whitehouse',1,'left',-20.8],['Jack Reed',2,'left',-33.3]],
    SC:[['Lindsey Graham',2,'right',10.3],['Tim Scott',3,'right',25.4]],
    SD:[['Mike Rounds',2,'right',31.3],['John Thune',3,'right',43.5]],
    TN:[['Marsha Blackburn',1,'right',29.6],['Bill Hagerty',2,'right',27.6]],
    TX:[['Ted Cruz',1,'right',8.5],['John Cornyn',2,'right',-3.2,{ dem:'James Talarico', rep:'John Cornyn' }]],
    UT:[['John Curtis',1,'right',31.7],['Mike Lee',3,'right',10.5]],
    VT:[['Bernie Sanders',1,'left',-31.5],['Peter Welch',3,'left',-40.4]],
    VA:[['Tim Kaine',1,'left',-8.9],['Mark Warner',2,'left',-12.1]],
    WA:[['Maria Cantwell',1,'left',-18.6],['Patty Murray',3,'left',-14.6]],
    WV:[['Jim Justice',1,'right',41.3],['Shelley Moore Capito',2,'right',43.3]],
    WI:[['Tammy Baldwin',1,'left',-0.9],['Ron Johnson',3,'right',1.0]],
    WY:[['John Barrasso',1,'right',46.3],['Cynthia Lummis',2,'right',46.1]],
  };

  const PROFILE_PRESETS = [
    { key:'communist', label:'Communist', social:78, economic:96, geography:78, populism:82 },
    { key:'democratic-socialist', label:'Democratic socialist', social:84, economic:88, geography:75, populism:68 },
    { key:'progressive', label:'Progressive', social:86, economic:74, geography:78, populism:55 },
    { key:'green-politics', label:'Green politics', social:84, economic:79, geography:76, populism:48 },
    { key:'social-dem', label:'Social democratic', social:72, economic:66, geography:70, populism:42 },
    { key:'social-liberal', label:'Social liberal', social:76, economic:55, geography:73, populism:34 },
    { key:'center', label:'Center', social:50, economic:50, geography:55, populism:38 },
    { key:'christian-dem', label:'Christian democratic', social:36, economic:56, geography:48, populism:38 },
    { key:'center-right', label:'Center-right', social:37, economic:38, geography:44, populism:42 },
    { key:'conservative', label:'Conservative right', social:26, economic:32, geography:36, populism:58 },
    { key:'national-populist', label:'National populist', social:24, economic:52, geography:30, populism:86 },
    { key:'fascist', label:'Fascist', social:8, economic:72, geography:26, populism:92 },
    { key:'libertarian', label:'Libertarian', social:68, economic:10, geography:48, populism:48 },
    { key:'regional', label:'Regional / localist', social:50, economic:50, geography:50, populism:62 },
  ];

  // Columns: 2025 union %, 2023 personal/fiscal freedom rank, 2024 FEC vote % for Libertarian, Green, independent, and socialist candidates.
  const STATE_CULTURE_DATA = {
    AL:{u:6.3,p:42,f:31,l:.218,g:.191,i:.533,s:0}, AK:{u:18.1,p:17,f:15,l:.899,g:.693,i:1.677,s:0},
    AZ:{u:4.1,p:2,f:10,l:.528,g:.540,i:0,s:.020}, AR:{u:2.8,p:44,f:30,l:.483,g:.361,i:1.121,s:0},
    CA:{u:14.9,p:11,f:48,l:.420,g:1.058,i:1.246,s:.457}, CO:{u:5.9,p:24,f:17,l:.671,g:.543,i:1.116,s:.028},
    CT:{u:16.1,p:16,f:20,l:.383,g:.812,i:.480,s:.015}, DE:{u:10.4,p:43,f:47,l:.397,g:.178,i:.904,s:.017},
    DC:{u:9.2,p:12,f:45,l:0,g:0,i:.852,s:0}, FL:{u:5.4,p:22,f:1,l:.293,g:.396,i:0,s:.110},
    GA:{u:5.1,p:38,f:9,l:.394,g:.347,i:0,s:0}, HI:{u:24.8,p:39,f:50,l:.529,g:.849,i:0,s:.375},
    ID:{u:4.1,p:49,f:14,l:.493,g:.328,i:1.416,s:.136}, IL:{u:13.1,p:18,f:36,l:.062,g:.551,i:1.428,s:.051},
    IN:{u:8.3,p:23,f:21,l:.696,g:0,i:.999,s:.028}, IA:{u:6.8,p:25,f:43,l:.434,g:0,i:.789,s:.086},
    KS:{u:6.2,p:37,f:38,l:.574,g:0,i:1.229,s:0}, KY:{u:8.9,p:47,f:29,l:.310,g:.365,i:.808,s:.019},
    LA:{u:4.4,p:36,f:26,l:.341,g:.356,i:.331,s:.074}, ME:{u:11.9,p:3,f:41,l:.636,g:1.079,i:0,s:0},
    MD:{u:12.7,p:27,f:35,l:.512,g:1.091,i:.949,s:.037}, MA:{u:14.5,p:9,f:18,l:.511,g:.764,i:0,s:.371},
    MI:{u:13,p:19,f:11,l:.396,g:.788,i:.473,s:.008}, MN:{u:14.1,p:20,f:40,l:.466,g:.500,i:.738,s:.092},
    MS:{u:4.2,p:45,f:42,l:.207,g:.153,i:.439,s:.088}, MO:{u:9.8,p:8,f:8,l:.797,g:.572,i:0,s:.021},
    MT:{u:11.2,p:7,f:19,l:.709,g:.477,i:1.961,s:0}, NE:{u:6.6,p:40,f:45,l:.672,g:.303,i:0,s:0},
    NV:{u:13,p:1,f:6,l:.408,g:0,i:0,s:0}, NH:{u:8.9,p:4,f:2,l:.536,g:.445,i:0,s:0},
    NJ:{u:14.7,p:35,f:34,l:.246,g:.914,i:.550,s:.119}, NM:{u:6.1,p:5,f:39,l:.406,g:.499,i:1.035,s:.264},
    NY:{u:21.3,p:30,f:49,l:.065,g:.565,i:0,s:.077}, NC:{u:2.5,p:33,f:27,l:.388,g:.434,i:0,s:.009},
    ND:{u:6,p:31,f:12,l:1.691,g:0,i:0,s:0}, OH:{u:11.6,p:29,f:16,l:.489,g:0,i:0,s:.031},
    OK:{u:6.1,p:21,f:24,l:.587,g:0,i:1.023,s:0}, OR:{u:15.1,p:14,f:44,l:.404,g:.851,i:1.503,s:0},
    PA:{u:10.9,p:34,f:5,l:.472,g:.489,i:0,s:0}, RI:{u:16.1,p:15,f:22,l:.315,g:.565,i:.983,s:.229},
    SC:{u:2.7,p:46,f:32,l:.497,g:.319,i:0,s:.120}, SD:{u:2.3,p:21,f:3,l:.648,g:0,i:1.680,s:0},
    TN:{u:4.8,p:41,f:4,l:0,g:.293,i:.703,s:.113}, TX:{u:4.9,p:50,f:7,l:.602,g:.726,i:0,s:.021},
    UT:{u:3.8,p:26,f:33,l:1.136,g:.552,i:0,s:.214}, VT:{u:13.1,p:6,f:46,l:.495,g:.242,i:1.598,s:.463},
    VA:{u:5.4,p:12,f:25,l:.440,g:.775,i:0,s:.187}, WA:{u:18,p:13,f:28,l:.419,g:.758,i:1.398,s:.222},
    WV:{u:8.5,p:10,f:37,l:.400,g:.332,i:1.173,s:.010}, WI:{u:6.4,p:28,f:23,l:.307,g:.359,i:.518,s:.059},
    WY:{u:6,p:48,f:13,l:1.558,g:0,i:0,s:0},
  };

  const STATE_CULTURE_ACCENTS = {
    AK:{localist:1,moderate:.35}, AL:{traditional:.5}, AR:{traditional:.35,populist:.5},
    CA:{progressive:.5}, CO:{moderate:.35,liberty:.25}, DC:{progressive:.9},
    HI:{localist:1,progressive:.35}, IA:{populist:.5}, ID:{traditional:.4},
    KY:{populist:.75,traditional:.3}, LA:{localist:.4,populist:.45,traditional:.35},
    MA:{progressive:.55}, ME:{moderate:.8,localist:.65,liberty:.25},
    MI:{labor:.25,populist:.35}, MN:{labor:.25,moderate:.3,progressive:.25},
    MO:{populist:.5}, MS:{traditional:.5}, NH:{liberty:1,moderate:.6,localist:.25},
    NM:{localist:.55,liberty:.2}, NY:{progressive:.35}, OH:{labor:.2,populist:.55},
    OK:{traditional:.4,populist:.5}, OR:{progressive:.65}, PA:{labor:.2,populist:.35},
    SC:{traditional:.4}, TN:{traditional:.5,populist:.4}, TX:{traditional:.4,localist:.3},
    UT:{traditional:1,localist:.35}, VT:{progressive:1,localist:.6},
    WA:{progressive:.5,labor:.25}, WI:{labor:.2,populist:.35}, WV:{populist:1,labor:.35,localist:.35},
  };

  const PROFILE_CULTURE_WEIGHTS = {
    communist:{ labor:.32, collectivist:.30, socialist:.28, progressive:.10 },
    'democratic-socialist':{ labor:.28, collectivist:.25, socialist:.18, progressive:.29 },
    progressive:{ progressive:.48, green:.25, personalFreedom:.17, labor:.10 },
    'green-politics':{ green:.48, progressive:.28, personalFreedom:.12, localist:.12 },
    'social-dem':{ labor:.28, progressive:.28, collectivist:.22, moderate:.22 },
    'social-liberal':{ personalFreedom:.32, progressive:.30, moderate:.25, green:.13 },
    center:{ moderate:.72, independent:.28 },
    'christian-dem':{ traditional:.43, moderate:.30, labor:.12, localist:.15 },
    'center-right':{ moderate:.38, market:.35, traditional:.27 },
    conservative:{ traditional:.53, market:.32, localist:.15 },
    'national-populist':{ populist:.58, traditional:.20, labor:.10, localist:.12 },
    fascist:{ traditional:.34, populist:.34, collectivist:.24, labor:.08 },
    libertarian:{ liberty:.55, libertarian:.30, personalFreedom:.15 },
    regional:{ localist:.62, independent:.23, moderate:.15 },
  };

  const GOVERNMENT_AGENDA = [
    { key:'budget', label:'Federal budget', desc:'Keeps the government funded and tests basic governing discipline.', chambers:['house','senate'], difficulty:2, bipartisan:0.10 },
    { key:'cabinet', label:'Cabinet slate', desc:'Senate confirmation vote for the incoming administration.', chambers:['senate'], difficulty:1, bipartisan:0.08 },
    { key:'tax', label:'Tax package', desc:'A partisan fiscal bill with narrow crossover appeal.', chambers:['house','senate'], difficulty:4, bipartisan:0.04 },
    { key:'immigration', label:'Border and immigration bill', desc:'A high-pressure package where populist and conservative parties defect less.', chambers:['house','senate'], difficulty:5, bipartisan:0.09 },
    { key:'rights', label:'Civil rights act', desc:'A social-policy bill that progressive and liberal parties prioritize.', chambers:['house','senate'], difficulty:4, bipartisan:0.12 },
    { key:'judges', label:'Supreme Court nominee', desc:'Senate-only confirmation with strong party discipline.', chambers:['senate'], difficulty:6, bipartisan:0.03 },
    { key:'constitutional', label:'Constitutional amendment', desc:'Requires two-thirds in both chambers.', chambers:['house','senate'], difficulty:7, bipartisan:0.18, supermajority:true },
  ];

  const DEFAULT_STATE = {
    uiVersion: 13,
    electionMode: 'president',
    mapMode: 'states',
    selectedState: 'PA',
    selectedCounty: '',
    selectedDistrict: 'PA-01',
    selectedElectoralUnit: '',
    selectedSenateClass: '',
    editingRace: '',
    partiesOpen: true,
    resultEdits: { states:{}, counties:{}, districts:{}, electoralUnits:{}, senateStates:{}, senateSeats:{} },
    settings: {
      urbanTurnout: 0,
      volatility: 0.9,
      coalitionMode: true,
      seed: 2028,
      reporting: 0,
      simDuration: 120,
      chamberView: 'bloc',
      mapView: 'bloc',
    },
    government: {
      open: true,
      name: '',
      presidentId: '',
      vicePresidentId: '',
      cabinetIds: [],
      supportIds: [],
      passiveIds: [],
      delegationMode: 'auto',
      delegationVotes: {},
      selectedDelegationState: '',
      agenda: 'budget',
      history: [],
    },
    blocs:[],
    parties: [
      {
        id:'dem',
        party:'Democratic Party',
        short:'DEM',
        candidate:'Kamala Harris',
        color:'#2563eb',
        image:'',
        bloc:'',
        social:66,
        economic:65,
        geography:68,
        populism:42,
        base:48.4,
        strongholds:{ CA:8, NY:7, MD:7, MA:7, WA:6, OR:6, IL:7, DC:14 },
      },
      {
        id:'gop',
        party:'Republican Party',
        short:'GOP',
        candidate:'Donald Trump',
        color:'#dc2626',
        image:'',
        bloc:'',
        social:30,
        economic:36,
        geography:35,
        populism:76,
        base:47.9,
        strongholds:{ WY:10, WV:10, OK:9, ID:9, AL:8, AR:8, TN:8, ND:8 },
      },
      {
        id:'fwd',
        party:'Forward Alliance',
        short:'FWD',
        candidate:'Andrew Yang',
        color:'#f59e0b',
        image:'',
        bloc:'',
        social:50,
        economic:50,
        geography:56,
        populism:42,
        base:1.8,
        strongholds:{ UT:4, AK:4, CO:3 },
      },
      {
        id:'grn',
        party:'Green Party',
        short:'GRN',
        candidate:'Jill Stein',
        color:'#16a34a',
        image:'',
        bloc:'',
        social:80,
        economic:78,
        geography:76,
        populism:58,
        base:0.9,
        strongholds:{ VT:5, OR:4, WA:4, CA:3 },
      },
      {
        id:'lib',
        party:'Libertarian Party',
        short:'LIB',
        candidate:'Chase Oliver',
        color:'#eab308',
        image:'',
        bloc:'',
        social:42,
        economic:14,
        geography:45,
        populism:52,
        base:1.0,
        strongholds:{ AK:5, WY:4, MT:4, NH:4 },
      },
    ],
  };

  const stateByAbbr = new Map(STATE_META.map(state => [state.abbr, state]));
  const SENATE_STATE_META = STATE_META.filter(state => state.abbr !== 'DC');
  const statePathByAbbr = new Map();
  const countiesByState = new Map();
  const houseDistricts = [];
  const houseDistrictById = new Map();
  const houseDistrictsByState = new Map();
  const baselineCountyById = new Map();
  const baselineStateByAbbr = new Map();
  const baselineNational = { demPct:51.293, gopPct:46.839, otherPct:1.869, total:158433557 };
  let countTimer = null;
  let app = loadState();
  let tooltip = null;
  let imageTimers = new Map();
  let imageBooted = false;
  let forcedOpenPartyId = '';
  let lastCandidateRenderMode = '';
  let winnerAnimationEpoch = 0;
  let lastPartyDrawerSignature = '';
  let electionViewRendered = false;
  let readoutFrame = 0;
  let pendingReadoutOptions = null;
  let mapRenderTimer = 0;
  let governmentRenderTimer = 0;
  let saveTimer = 0;
  let pendingGovernmentAnimation = null;
  let governmentElectionSnapshot = null;
  let electionResultRevision = 0;
  const electionResultCache = new Map();
  let interactiveRenderFrame = 0;
  let interactiveRenderTimer = 0;
  let pendingInteractiveRender = null;
  let electionWarmupHandle = 0;
  let electionWarmupUsesIdle = false;
  const mapCameraByKey = new Map();
  const mapPointers = new Map();
  let activeMapCameraKey = '';
  let mapGesture = null;
  let suppressMapClickUntil = 0;
  let governmentFormationInitialized = false;
  let lastGovernmentFormationKey = '';
  const animatedWinnerBadges = new Set();
  const candidatePhotoSources = new WeakMap();
  const candidatePartnerKeys = new WeakMap();
  const editorPhotoSources = new WeakMap();
  const stableMarkup = new WeakMap();

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeState(raw) {
    const input = raw || {};
    const savedVersion = Number(input.uiVersion) || 0;
    const out = {
      ...clone(DEFAULT_STATE),
      ...input,
      settings: { ...clone(DEFAULT_STATE.settings), ...(input.settings || {}) },
      parties: Array.isArray(input.parties) && input.parties.length
        ? input.parties.map((party, index) => normalizeParty(party, index, savedVersion))
        : clone(DEFAULT_STATE.parties).map((party, index) => normalizeParty(party, index, DEFAULT_STATE.uiVersion)),
      blocs: normalizeBlocs(Array.isArray(input.blocs) && input.blocs.length ? input.blocs : clone(DEFAULT_STATE.blocs)),
    };
    out.government = normalizeGovernment(input.government, out.parties);
    if (!stateByAbbr.has(out.selectedState)) out.selectedState = 'PA';
    out.electionMode = ['house', 'senate'].includes(input.electionMode) ? input.electionMode : 'president';
    out.mapMode = out.mapMode === 'counties' ? 'counties' : 'states';
    out.uiVersion = 13;
    out.partiesOpen = input.uiVersion >= 2 ? input.partiesOpen !== false : true;
    out.selectedCounty = String(input.selectedCounty || '');
    out.selectedDistrict = String(input.selectedDistrict || 'PA-01');
    out.selectedElectoralUnit = String(input.selectedElectoralUnit || '');
    out.selectedSenateClass = String(input.selectedSenateClass || '');
    out.editingRace = String(input.editingRace || '');
    out.resultEdits = savedVersion < 8
      ? normalizeResultEdits({})
      : normalizeResultEdits(input.resultEdits);
    out.settings.urbanTurnout = clamp(out.settings.urbanTurnout, -15, 15);
    out.settings.volatility = clamp(out.settings.volatility, 0, 12);
    out.settings.reporting = clamp(out.settings.reporting, 0, 100);
    out.settings.simDuration = [120, 300, 600].includes(Number(out.settings.simDuration)) ? Number(out.settings.simDuration) : 120;
    out.settings.chamberView = out.settings.chamberView === 'party' ? 'party' : 'bloc';
    out.settings.mapView = out.settings.mapView === 'party' ? 'party' : 'bloc';
    out.settings.seed = Math.round(Number(out.settings.seed) || 2028);
    if (savedVersion < 4) {
      const legacyBlocs = new Set(['Democratic','Republican','Independent','Progressive','Libertarian']);
      out.parties.forEach(party => {
        if (legacyBlocs.has(party.bloc)) party.bloc = '';
      });
      out.blocs = out.blocs.filter(bloc => !legacyBlocs.has(bloc.name));
    }
    out.parties.map(party => party.bloc).filter(Boolean).forEach(name => {
      if (!findBlocInList(out.blocs, name)) out.blocs.push(normalizeBloc({ name }, out.blocs.length));
    });
    return out;
  }

  function normalizeGovernment(government = {}, parties = []) {
    const valid = new Set(parties.map(party => party.id));
    const uniqueIds = ids => [...new Set(Array.isArray(ids) ? ids.map(String) : [])].filter(id => valid.has(id));
    const cabinetIds = uniqueIds(government.cabinetIds || government.partyIds);
    const supportIds = uniqueIds(government.supportIds).filter(id => !cabinetIds.includes(id));
    const passiveIds = uniqueIds(government.passiveIds).filter(id => !cabinetIds.includes(id) && !supportIds.includes(id));
    const agenda = GOVERNMENT_AGENDA.some(item => item.key === government.agenda) ? government.agenda : 'budget';
    const history = Array.isArray(government.history) ? government.history.slice(0, 8).map(item => ({
      id:String(item.id || `vote-${Date.now()}`),
      label:String(item.label || 'Vote'),
      result:String(item.result || ''),
      detail:String(item.detail || ''),
      passed:!!item.passed,
    })) : [];
    const delegationVotes = {};
    Object.entries(government.delegationVotes || {}).forEach(([abbr, partyId]) => {
      const state = stateByAbbr.get(abbr);
      const choice = String(partyId || '');
      if (state && abbr !== 'DC' && (choice === 'deadlock' || valid.has(choice))) delegationVotes[abbr] = choice;
    });
    const selectedDelegationState = String(government.selectedDelegationState || '');
    return {
      open: government.open !== false,
      name: String(government.name || ''),
      presidentId: valid.has(String(government.presidentId || '')) ? String(government.presidentId) : '',
      vicePresidentId: valid.has(String(government.vicePresidentId || '')) ? String(government.vicePresidentId) : '',
      cabinetIds,
      supportIds,
      passiveIds,
      delegationMode: government.delegationMode === 'manual' ? 'manual' : 'auto',
      delegationVotes,
      selectedDelegationState: stateByAbbr.has(selectedDelegationState) && selectedDelegationState !== 'DC' ? selectedDelegationState : '',
      agenda,
      history,
    };
  }

  function normalizeBlocs(blocs = []) {
    const seen = new Map();
    blocs.forEach((bloc, index) => {
      const normalized = normalizeBloc(bloc, index);
      if (!normalized.name) return;
      seen.set(normalized.name.toLowerCase(), normalized);
    });
    return [...seen.values()];
  }

  function normalizeBloc(bloc, index = 0) {
    const name = typeof bloc === 'string' ? bloc.trim() : String(bloc?.name || '').trim();
    const color = typeof bloc === 'object' && /^#[0-9a-f]{6}$/i.test(String(bloc.color || '')) ? bloc.color : fallbackColor(index + 4);
    const short = shortCode(typeof bloc === 'object' ? (bloc.short || bloc.code || name) : name);
    const mode = typeof bloc === 'object' && String(bloc.mode || bloc.kind || '').toLowerCase() === 'coalition'
      ? 'coalition'
      : 'electoral';
    return { name, short, color, mode };
  }

  function findBlocInList(blocs, name) {
    const needle = String(name || '').toLowerCase();
    return (blocs || []).find(bloc => String(bloc.name || '').toLowerCase() === needle);
  }

  function normalizeParty(party, index = 0, sourceVersion = DEFAULT_STATE.uiVersion) {
    const economic = clamp(party.economic, 0, 100, 50);
    const image = String(party.image || '');
    return {
      id: String(party.id || `party-${Date.now()}-${index}`),
      party: String(party.party || party.name || 'New Party'),
      short: shortCode(party.short || party.party || party.name || 'NEW'),
      candidate: String(party.candidate || party.leader || ''),
      color: /^#[0-9a-f]{6}$/i.test(String(party.color || '')) ? party.color : fallbackColor(index),
      image,
      imageRemote: String(party.imageRemote || (isRemoteImageSource(image) ? image : '')),
      imageStatus: String(party.imageStatus || ''),
      bloc: String(party.bloc || ''),
      ballotAccess: party.ballotAccess === 'states' ? 'states' : 'nationwide',
      ballotStates: normalizeBallotStates(party.ballotStates),
      profile: PROFILE_PRESETS.some(preset => preset.key === party.profile) ? String(party.profile) : '',
      social: clamp(party.social ?? (100 - clamp(party.ideology, 0, 100, 50)), 0, 100, 50),
      economic: sourceVersion < 9 ? 100 - economic : economic,
      geography: clamp(party.geography ?? party.urban, 0, 100, 50),
      populism: clamp(party.populism, 0, 100, 50),
      base: clamp(party.base, 0.1, 100, 1),
      strongholds: normalizeStrongholds(party.strongholds),
    };
  }

  function normalizeBallotStates(states = []) {
    const selected = new Set(
      (Array.isArray(states) ? states : [])
        .map(abbr => String(abbr || '').toUpperCase())
        .filter(abbr => stateByAbbr.has(abbr))
    );
    return STATE_META.map(state => state.abbr).filter(abbr => selected.has(abbr));
  }

  function normalizeStrongholds(strongholds = {}) {
    const out = {};
    Object.entries(strongholds || {}).forEach(([abbr, value]) => {
      if (stateByAbbr.has(abbr)) out[abbr] = clamp(value, 0, 25, 0);
    });
    return out;
  }

  function normalizeResultEdits(edits = {}) {
    return {
      states: normalizeRaceEditBucket(edits.states),
      counties: normalizeRaceEditBucket(edits.counties),
      districts: normalizeRaceEditBucket(edits.districts),
      electoralUnits: normalizeRaceEditBucket(edits.electoralUnits),
      senateStates: normalizeRaceEditBucket(edits.senateStates),
      senateSeats: normalizeRaceEditBucket(edits.senateSeats),
    };
  }

  function normalizeRaceEditBucket(bucket = {}) {
    const out = {};
    Object.entries(bucket || {}).forEach(([key, value]) => {
      const shares = {};
      Object.entries(value?.shares || value || {}).forEach(([partyId, pctValue]) => {
        const pctValueNumber = clamp(pctValue, 0, 100, NaN);
        if (Number.isFinite(pctValueNumber)) shares[partyId] = pctValueNumber;
      });
      if (Object.keys(shares).length) out[key] = { shares };
    });
    return out;
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return normalizeState(JSON.parse(saved));
    } catch (e) {}
    return normalizeState(clone(DEFAULT_STATE));
  }

  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(app)); } catch (e) {}
  }

  function queueSaveState(delay = 160) {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = 0;
      saveState();
    }, delay);
  }

  function invalidateElectionResults() {
    electionResultRevision += 1;
    electionResultCache.clear();
    governmentElectionSnapshot = null;
    if (electionWarmupHandle) {
      if (electionWarmupUsesIdle && window.cancelIdleCallback) window.cancelIdleCallback(electionWarmupHandle);
      else clearTimeout(electionWarmupHandle);
      electionWarmupHandle = 0;
    }
  }

  function scheduleElectionCacheWarmup() {
    if (countTimer || document.hidden || electionWarmupHandle) return;
    const revision = electionResultRevision;
    const pendingModes = ['president','senate','house'].filter(mode => !electionResultCache.has(mode));
    if (!pendingModes.length) return;
    const warmNext = deadline => {
      electionWarmupHandle = 0;
      if (revision !== electionResultRevision || countTimer || document.hidden) return;
      if (deadline && !deadline.didTimeout && deadline.timeRemaining() < 6) {
        queueWarmup();
        return;
      }
      const mode = pendingModes.shift();
      if (mode) calculateElectionMode(mode);
      if (pendingModes.length && revision === electionResultRevision) queueWarmup();
    };
    const queueWarmup = () => {
      electionWarmupUsesIdle = typeof window.requestIdleCallback === 'function';
      electionWarmupHandle = electionWarmupUsesIdle
        ? window.requestIdleCallback(warmNext, { timeout:900 })
        : setTimeout(() => warmNext(null), 180);
    };
    queueWarmup();
  }

  function acknowledgeAction(button) {
    if (!(button instanceof HTMLElement)) return;
    button.classList.add('is-processing');
    button.setAttribute('aria-busy', 'true');
  }

  function clearActionAcknowledgements() {
    document.querySelectorAll('#us-election-wrap .is-processing').forEach(button => {
      button.classList.remove('is-processing');
      button.removeAttribute('aria-busy');
    });
  }

  function deferInteractiveRender(callback, button = null) {
    pendingInteractiveRender = callback;
    acknowledgeAction(button);
    if (interactiveRenderFrame || interactiveRenderTimer) return;
    const schedule = window.requestAnimationFrame || (next => setTimeout(next, 0));
    interactiveRenderFrame = schedule(() => {
      interactiveRenderFrame = 0;
      interactiveRenderTimer = setTimeout(() => {
        interactiveRenderTimer = 0;
        const render = pendingInteractiveRender;
        pendingInteractiveRender = null;
        try {
          render?.();
        } finally {
          clearActionAcknowledgements();
        }
      }, 0);
    });
  }

  function scheduleElectionReadouts(options = {}) {
    pendingReadoutOptions = pendingReadoutOptions
      ? {
          preserveCandidates: pendingReadoutOptions.preserveCandidates && options.preserveCandidates,
          includeMap: pendingReadoutOptions.includeMap || options.includeMap,
          skipGovernment: pendingReadoutOptions.skipGovernment && options.skipGovernment,
        }
      : { ...options };
    if (readoutFrame) return;
    const schedule = window.requestAnimationFrame || (callback => setTimeout(callback, 16));
    readoutFrame = schedule(() => {
      readoutFrame = 0;
      const nextOptions = pendingReadoutOptions || {};
      pendingReadoutOptions = null;
      renderElectionReadouts(nextOptions);
    });
  }

  function clearQueuedMapRender() {
    if (!mapRenderTimer) return;
    clearTimeout(mapRenderTimer);
    mapRenderTimer = 0;
  }

  function queueMapRender(delay = 70) {
    clearQueuedMapRender();
    mapRenderTimer = setTimeout(() => {
      mapRenderTimer = 0;
      const result = calculateElection();
      renderMap(result);
      renderSidebar(result);
    }, delay);
  }

  function clearQueuedGovernmentRender() {
    if (!governmentRenderTimer) return;
    clearTimeout(governmentRenderTimer);
    governmentRenderTimer = 0;
  }

  function queueGovernmentRender(delay = 90) {
    if (!app.government.open) return;
    clearQueuedGovernmentRender();
    governmentRenderTimer = setTimeout(() => {
      governmentRenderTimer = 0;
      renderGovernmentAssembly(calculateElection());
      renderControls();
    }, delay);
  }

  function fallbackColor(index) {
    return ['#2563eb','#dc2626','#f59e0b','#16a34a','#7c3aed','#0891b2','#be123c','#84cc16'][index % 8];
  }

  function clamp(value, min, max, fallback = min) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function setStableMarkup(element, markup) {
    if (stableMarkup.get(element) === markup) return;
    element.innerHTML = markup;
    stableMarkup.set(element, markup);
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return window.CSS.escape(String(value));
    return String(value).replace(/[^a-zA-Z0-9_-]/g, char => `\\${char}`);
  }

  function shortCode(value) {
    const cleaned = String(value || 'NEW').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    return (cleaned || 'NEW').slice(0, 3).padEnd(3, 'X');
  }

  function initials(name) {
    return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('') || '?';
  }

  function pct(value, digits = 1) {
    return `${(Number(value) || 0).toFixed(digits)}%`;
  }

  function marginText(value) {
    const n = Math.abs(Number(value) || 0);
    return n < 0.05 ? '<0.1' : n.toFixed(1);
  }

  function compactVotes(value) {
    const n = Math.round(Number(value) || 0);
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${Math.round(n / 1000)}K`;
    return String(n);
  }

  function formatVotes(value) {
    return Math.round(Number(value) || 0).toLocaleString();
  }

  function hashNumber(text) {
    let h = 2166136261;
    String(text).split('').forEach(char => {
      h ^= char.charCodeAt(0);
      h = Math.imul(h, 16777619);
    });
    return (h >>> 0) / 4294967295;
  }

  function prepareMapData() {
    const data = window.US_ELECTION_MAP_DATA;
    if (data) {
      (data.states || []).forEach(shape => statePathByAbbr.set(shape.abbr, shape));
      (data.counties || []).forEach(county => {
      if (!countiesByState.has(county.state)) countiesByState.set(county.state, []);
      countiesByState.get(county.state).push(county);
      });
    }
    const houseData = window.US_HOUSE_MAP_DATA;
    if (houseData) {
      (houseData.districts || []).forEach(district => {
        houseDistricts.push(district);
        houseDistrictById.set(district.id, district);
        if (!houseDistrictsByState.has(district.state)) houseDistrictsByState.set(district.state, []);
        houseDistrictsByState.get(district.state).push(district);
      });
    }
    const baseline = window.US_ELECTION_BASELINE_2020;
    if (baseline) {
      Object.assign(baselineNational, baseline.national || {});
      Object.entries(baseline.states || {}).forEach(([abbr, row]) => baselineStateByAbbr.set(abbr, row));
      Object.entries(baseline.counties || {}).forEach(([id, row]) => baselineCountyById.set(String(id).padStart(5, '0'), row));
    }
  }

  function partyLane(party) {
    const alignment = partyAlignmentScore(party);
    if (alignment <= 45) return 'left';
    if (alignment >= 55) return 'right';
    return 'center';
  }

  function partyAlignmentScore(party) {
    const market = 100 - clamp(party?.economic, 0, 100, 50);
    const conservative = 100 - clamp(party?.social, 0, 100, 50);
    return market * 0.52 + conservative * 0.48;
  }

  function resolvedProfileKey(party) {
    if (PROFILE_CULTURE_WEIGHTS[party?.profile]) return party.profile;
    let nearest = PROFILE_PRESETS[0];
    let nearestDistance = Infinity;
    PROFILE_PRESETS.forEach(preset => {
      const distance =
        Math.pow((clamp(party?.social, 0, 100, 50) - preset.social) / 34, 2) +
        Math.pow((clamp(party?.economic, 0, 100, 50) - preset.economic) / 34, 2) +
        Math.pow((clamp(party?.geography, 0, 100, 50) - preset.geography) / 44, 2) +
        Math.pow((clamp(party?.populism, 0, 100, 50) - preset.populism) / 40, 2);
      if (distance < nearestDistance) {
        nearest = preset;
        nearestDistance = distance;
      }
    });
    return nearest.key;
  }

  function ballotCultureSignal(value, nationalShare, spread) {
    const share = Number(value);
    if (!Number.isFinite(share) || share <= 0) return 0;
    return clamp((share - nationalShare) / spread, -1, 1, 0);
  }

  function stateCultureTraits(state, options, baseline) {
    const data = STATE_CULTURE_DATA[state.abbr] || {};
    const accent = STATE_CULTURE_ACCENTS[state.abbr] || {};
    const twoPartyTotal = Math.max(0.01, Number(baseline.demPct) + Number(baseline.gopPct));
    const partisan = clamp((Number(baseline.demPct) - Number(baseline.gopPct)) / twoPartyTotal * 2.5, -1, 1, 0);
    const urban = options.county?.urban ?? state.urban;
    const urbanSignal = clamp((Number(urban) + app.settings.urbanTurnout - 50) / 45, -1, 1, 0);
    const personalFreedom = clamp((25.5 - Number(data.p || 25.5)) / 24.5, -1, 1, 0);
    const market = clamp((25.5 - Number(data.f || 25.5)) / 24.5, -1, 1, 0);
    const labor = clamp((Number(data.u || 10) - 10) / 13, -1, 1, 0);
    const libertarian = ballotCultureSignal(data.l, 0.42, 0.9);
    const green = ballotCultureSignal(data.g, 0.56, 0.65);
    const independent = ballotCultureSignal(data.i, 0.49, 1.1);
    const socialist = ballotCultureSignal(data.s, 0.11, 0.4);
    const closeness = 1 - Math.min(1, Math.abs(partisan) * 1.15);
    const traits = {
      personalFreedom,
      market,
      labor,
      libertarian,
      green,
      independent,
      socialist,
      moderate: closeness * 0.82 + independent * 0.18,
      progressive: partisan * 0.42 + urbanSignal * 0.22 + green * 0.22 + socialist * 0.14,
      collectivist: partisan * 0.38 + labor * 0.30 - market * 0.20 + socialist * 0.12,
      traditional: -partisan * 0.42 - urbanSignal * 0.24 - personalFreedom * 0.10,
      liberty: personalFreedom * 0.36 + market * 0.30 + libertarian * 0.34,
      populist: -urbanSignal * 0.32 - partisan * 0.10 + independent * 0.18 + labor * 0.10,
      localist: independent * 0.42 + personalFreedom * 0.10,
    };
    Object.entries(accent).forEach(([trait, value]) => {
      traits[trait] = (traits[trait] || 0) + Number(value) * 0.55;
    });
    Object.keys(traits).forEach(trait => {
      traits[trait] = clamp(traits[trait], -1, 1, 0);
    });
    return traits;
  }

  function stateProfileCultureScore(party, state, options, baseline) {
    const weights = PROFILE_CULTURE_WEIGHTS[resolvedProfileKey(party)] || PROFILE_CULTURE_WEIGHTS.center;
    const traits = stateCultureTraits(state, options, baseline);
    return clamp(Object.entries(weights).reduce((score, [trait, weight]) => {
      return score + (traits[trait] || 0) * weight;
    }, 0), -1, 1, 0);
  }

  function partyRunsInState(party, stateOrAbbr) {
    if (party?.ballotAccess !== 'states') return true;
    const abbr = typeof stateOrAbbr === 'string' ? stateOrAbbr : stateOrAbbr?.abbr;
    return !!abbr && (party.ballotStates || []).includes(abbr);
  }

  function ballotCoverageShare(party) {
    if (party?.ballotAccess !== 'states') return 1;
    const selected = new Set(party.ballotStates || []);
    const nationalTurnout = STATE_META.reduce((sum, state) => sum + stateVoteTotal(state), 0) || 1;
    const coveredTurnout = STATE_META.reduce((sum, state) => {
      return sum + (selected.has(state.abbr) ? stateVoteTotal(state) : 0);
    }, 0);
    return coveredTurnout / nationalTurnout;
  }

  function partyEffectiveNationalBase(party) {
    return Math.max(0, Number(party?.base) || 0) * ballotCoverageShare(party);
  }

  function voteSetupValidation() {
    const total = app.parties.reduce((sum, party) => sum + partyEffectiveNationalBase(party), 0);
    const uncoveredStates = STATE_META
      .filter(state => !app.parties.some(party => partyRunsInState(party, state)))
      .map(state => state.abbr);
    const inRange = total >= 95 && total <= 105;
    return {
      total,
      uncoveredStates,
      valid: inRange && uncoveredStates.length === 0,
      message: uncoveredStates.length
        ? `No party runs in ${uncoveredStates.slice(0, 4).join(', ')}${uncoveredStates.length > 4 ? ` +${uncoveredStates.length - 4}` : ''}`
        : inRange
          ? `Vote setup ${total.toFixed(1)}%`
          : `Vote setup ${total.toFixed(1)}% · needs 95–105%`,
    };
  }

  function voteTargets(state = null) {
    let targetRows;
    if (!state) {
      const effectiveTotal = app.parties.reduce((sum, party) => sum + partyEffectiveNationalBase(party), 0) || 1;
      targetRows = app.parties.map(party => ({
        party,
        pct:partyEffectiveNationalBase(party) / effectiveTotal * 100,
      }));
    } else {
      const eligible = app.parties.filter(party => partyRunsInState(party, state));
      const regional = eligible.filter(party => party.ballotAccess === 'states');
      const nationwide = eligible.filter(party => party.ballotAccess !== 'states');
      const regionalTotal = regional.reduce((sum, party) => sum + Math.max(0, Number(party.base) || 0), 0);
      const nationwideTotal = nationwide.reduce((sum, party) => sum + Math.max(0, Number(party.base) || 0), 0);
      if (!eligible.length) {
        targetRows = [];
      } else if (!nationwide.length || regionalTotal >= 100) {
        const total = regionalTotal || eligible.reduce((sum, party) => sum + Math.max(0, Number(party.base) || 0), 0) || 1;
        const pool = regionalTotal ? regional : eligible;
        targetRows = pool.map(party => ({ party, pct:Math.max(0, Number(party.base) || 0) / total * 100 }));
      } else {
        const nationwidePool = Math.max(0, 100 - regionalTotal);
        targetRows = [
          ...regional.map(party => ({ party, pct:Math.max(0, Number(party.base) || 0) })),
          ...nationwide.map(party => ({
            party,
            pct:nationwidePool * Math.max(0, Number(party.base) || 0) / Math.max(0.001, nationwideTotal),
          })),
        ];
      }
    }
    const rows = targetRows
      .filter(row => row.pct > 0.00001)
      .map(row => ({ ...row, lane:partyLane(row.party) }));
    const laneTotals = rows.reduce((acc, row) => {
      acc[row.lane] += row.pct;
      return acc;
    }, { left:0, right:0, center:0 });
    return { rows, laneTotals };
  }

  function baselineForRace(state, options = {}) {
    const county = options.county;
    const district = options.district;
    if (district) {
      return {
        demPct: Number(district.demPct) || clamp(50 - Number(district.lean || 0), 4, 94),
        gopPct: Number(district.gopPct) || clamp(50 + Number(district.lean || 0), 4, 94),
        otherPct: Number(district.otherPct) || 2,
        total: Math.max(1, Number(district.total) || 520000),
      };
    }
    if (options.senateSeat) return senateSeatBaseline(state, options.senateSeat);
    const row = county?.baseline || baselineStateByAbbr.get(state.abbr);
    if (Number.isFinite(Number(options.unitLean))) {
      const unitLean = Number(options.unitLean);
      return {
        demPct:clamp(50 - unitLean / 2, 4, 96),
        gopPct:clamp(50 + unitLean / 2, 4, 96),
        otherPct:Number(row?.otherPct) || 2,
        total:Math.max(1, Math.round((Number(row?.total) || state.ev * 100000) / Math.max(1, state.ev - 2))),
      };
    }
    if (row) return row;
    const dem = clamp(50 - state.lean, 4, 94);
    const gop = clamp(50 + state.lean, 4, 94);
    const total = dem + gop;
    return { demPct:dem / total * 100, gopPct:gop / total * 100, otherPct:2, total:Math.max(1, state.ev * 100000) };
  }

  function senateSeatBaseline(state, seat) {
    const base = baselineStateByAbbr.get(state.abbr) || {
      demPct: clamp(50 - state.lean, 4, 94),
      gopPct: clamp(50 + state.lean, 4, 94),
      otherPct:2,
      total:Math.max(1, state.ev * 100000),
    };
    const twoPartyTotal = Math.max(0.01, Number(base.demPct) + Number(base.gopPct));
    const stateDemTwoParty = Number(base.demPct) / twoPartyTotal * 100;
    const seatMargin = Number(seat.margin);
    const hasSeatMargin = Number.isFinite(seatMargin);
    const homeLean = Math.abs(Number(state.lean) || 0);
    const incumbency = clamp(4.2 - homeLean * 0.045, 2.4, 4.2);
    const classTexture = (Number(seat.class) || 2) === 1 ? 0.35 : (Number(seat.class) || 2) === 3 ? -0.15 : 0;
    const seatShift = (seat.side === 'left' ? incumbency : -incumbency) + classTexture;
    const dem = hasSeatMargin
      ? clamp(50 - seatMargin / 2, 5, 95)
      : clamp(stateDemTwoParty + seatShift, 5, 95);
    return {
      demPct:dem,
      gopPct:100 - dem,
      otherPct:Number(base.otherPct) || 2,
      total:Math.max(1, Math.round((Number(base.total) || state.ev * 100000) / 2)),
      incumbent:seat.name,
      senateClass:seat.class,
      seatSide:seat.side,
      seatMargin:hasSeatMargin ? seatMargin : null,
    };
  }

  function logit(value) {
    const p = clamp(value, 0.01, 99.99) / 100;
    return Math.log(p / (1 - p));
  }

  function logistic(value) {
    return 1 / (1 + Math.exp(-value));
  }

  function twoPartyLeftShare(baseline, targets, options = {}) {
    const baselineLeft = baseline.demPct / Math.max(0.01, baseline.demPct + baseline.gopPct) * 100;
    const nationalBaselineLeft = baselineNational.demPct / Math.max(0.01, baselineNational.demPct + baselineNational.gopPct) * 100;
    const targetLeft = targets.laneTotals.left / Math.max(0.01, targets.laneTotals.left + targets.laneTotals.right) * 100;
    if (options.district) return districtTwoPartyLeftShare(baseline, targets, options, targetLeft, nationalBaselineLeft);
    const baselineMargin = Math.abs((Number(baseline.demPct) || 0) - (Number(baseline.gopPct) || 0));
    const swingScale = options.senateSeat
      ? clamp(0.98 - baselineMargin * 0.007, 0.68, 0.95)
      : 1;
    return logistic(logit(baselineLeft) + (logit(targetLeft) - logit(nationalBaselineLeft)) * swingScale) * 100;
  }

  function districtTwoPartyLeftShare(baseline, targets, options, targetLeft, nationalBaselineLeft) {
    const district = options.district || {};
    const pvi = Number(district.pviValue);
    const nationalMargin = (targetLeft - 50) * 2;
    if (Number.isFinite(pvi)) {
      return clamp(50 + (nationalMargin - pvi) / 2, 3, 97);
    }
    const baselineLeft = baseline.demPct / Math.max(0.01, baseline.demPct + baseline.gopPct) * 100;
    const baselineMargin = (baselineLeft - 50) * 2;
    const nationalBaselineMargin = (nationalBaselineLeft - 50) * 2;
    return clamp(50 + (baselineMargin + (nationalMargin - nationalBaselineMargin) * 0.70) / 2, 3, 97);
  }

  function chamberTwoPartyLeftShare(baseline, targets, options, targetLeft) {
    if (options.district) {
      return districtTwoPartyLeftShare(
        baseline,
        targets,
        options,
        targetLeft,
        baselineNational.demPct / Math.max(0.01, baselineNational.demPct + baselineNational.gopPct) * 100
      );
    }
    const baselineLeft = baseline.demPct / Math.max(0.01, baseline.demPct + baseline.gopPct) * 100;
    const nationalBaselineLeft = baselineNational.demPct / Math.max(0.01, baselineNational.demPct + baselineNational.gopPct) * 100;
    const baselineMargin = Math.abs((Number(baseline.demPct) || 0) - (Number(baseline.gopPct) || 0));
    const swingScale = clamp(0.98 - baselineMargin * 0.007, 0.68, 0.95);
    return logistic(logit(baselineLeft) + (logit(targetLeft) - logit(nationalBaselineLeft)) * swingScale) * 100;
  }

  function politicalCampRows(targetRows) {
    const rows = targetRows.map(row => ({ ...row, alignment:partyAlignmentScore(row.party), camp:partyLane(row.party) }));
    return {
      left: rows.filter(row => row.camp === 'left'),
      right: rows.filter(row => row.camp === 'right'),
      center: rows.filter(row => row.camp === 'center'),
    };
  }

  function sharePool(rows, pool, lane, baseline, state, options) {
    if (!rows.length || pool <= 0) return [];
    const weighted = rows.map(row => ({
      party: row.party,
      weight: Math.max(0.001, row.pct) * politicalProfileAffinity(row.party, lane, baseline, state, options),
    }));
    const total = weighted.reduce((sum, row) => sum + row.weight, 0) || 1;
    return weighted.map(row => ({ party:row.party, pct:pool * row.weight / total }));
  }

  function chamberRaceShares(state, options, baseline, targets) {
    const camps = politicalCampRows(targets.rows);
    const leftTotal = camps.left.reduce((sum, row) => sum + row.pct, 0);
    const rightTotal = camps.right.reduce((sum, row) => sum + row.pct, 0);
    if (leftTotal <= 0 || rightTotal <= 0) return null;
    const targetLeft = leftTotal / Math.max(0.01, leftTotal + rightTotal) * 100;
    const leftTwoParty = chamberTwoPartyLeftShare(baseline, targets, options, targetLeft);
    const centerTotal = camps.center.reduce((sum, row) => sum + row.pct, 0);
    const closeness = 1 - Math.min(1, Math.abs(leftTwoParty - 50) / 32);
    const centerShare = Math.min(24, centerTotal * (0.48 + closeness * 0.32));
    const majorShare = Math.max(1, 100 - centerShare);
    const rows = [
      ...sharePool(camps.left, majorShare * leftTwoParty / 100, 'left', baseline, state, options),
      ...sharePool(camps.right, majorShare * (100 - leftTwoParty) / 100, 'right', baseline, state, options),
      ...sharePool(camps.center, centerShare, 'center', baseline, state, options),
    ];
    return finalizeRaceShares(rows, state, options);
  }

  function politicalProfileAffinity(party, lane, baseline, state, options = {}) {
    const county = options.county;
    const urban = county?.urban ?? state.urban;
    const partisan = (baseline.demPct - baseline.gopPct) / 100;
    const urbanSignal = (urban + app.settings.urbanTurnout - 50) / 50;
    const populistTerrain = clamp(50 + Math.abs(partisan) * 30 - urbanSignal * 7, 18, 88);
    const terrainScale = options.district ? 0.72 : options.senateSeat ? 0.84 : 1;
    const socialSignal = (clamp(party.social, 0, 100, 50) - 50) / 50;
    const stateEconomySignal = (clamp(party.economic, 0, 100, 50) - 50) / 50;
    let mult = 1;
    mult *= 1 + ((party.geography - 50) / 50) * urbanSignal * 0.26 * terrainScale;
    mult *= 1 + ((party.populism - 50) / 50) * ((populistTerrain - 50) / 50) * 0.16 * terrainScale;
    mult *= 1 + socialSignal * urbanSignal * 0.14 * terrainScale;
    mult *= 1 + stateEconomySignal * partisan * 0.14 * terrainScale;
    if (lane === 'left') {
      mult *= 1 + Math.max(0, socialSignal) * Math.max(0, urbanSignal) * 0.10 * terrainScale;
    } else if (lane === 'right') {
      mult *= 1 + Math.max(0, -socialSignal) * Math.max(0, -urbanSignal) * 0.10 * terrainScale;
    } else {
      mult *= 1 + (1 - Math.abs(partisan)) * 0.16 * terrainScale;
      mult *= 1 - Math.abs(partyAlignmentScore(party) - 50) / 100 * 0.18 * terrainScale;
    }
    const strongholdScale = options.district || options.senateSeat ? 0.028 : 0.018;
    mult *= 1 + (Number(party.strongholds[state.abbr]) || 0) * strongholdScale;
    if (app.settings.volatility) {
      const key = `${app.settings.seed}:${party.id}:${state.abbr}:${options.label || ''}:${county?.id || ''}:${options.district?.id || ''}:${options.senateSeat?.class || ''}:${options.senateSeat?.side || ''}`;
      mult *= 1 + (hashNumber(key) - 0.5) * app.settings.volatility * 0.012;
    }
    return Math.max(0.08, mult);
  }

  function raceShares(state, options = {}) {
    const baseline = baselineForRace(state, options);
    const targets = voteTargets(state);
    if (!targets.rows.length) return [];
    if (targets.rows.length === 1) return [{ party:targets.rows[0].party, pct:100 }];
    if (options.district || options.senateSeat) {
      const chamberShares = chamberRaceShares(state, options, baseline, targets);
      if (chamberShares) return chamberShares;
    }
    const leftTwoParty = twoPartyLeftShare(baseline, targets, options);
    const centerBase = Math.min(35, targets.laneTotals.center);
    const countyCloseness = 1 - Math.min(1, Math.abs(baseline.demPct - baseline.gopPct) / 70);
    const centerShare = centerBase * (0.72 + countyCloseness * 0.38);
    const majorShare = Math.max(1, 100 - centerShare);
    const laneShares = {
      left: majorShare * leftTwoParty / 100,
      right: majorShare * (100 - leftTwoParty) / 100,
      center: centerShare,
    };
    const rows = [];
    ['left', 'right', 'center'].forEach(lane => {
      const laneRows = targets.rows.filter(row => row.lane === lane);
      if (!laneRows.length || laneShares[lane] <= 0) return;
      const weighted = laneRows.map(row => ({
        party: row.party,
        weight: Math.max(0.001, row.pct) * politicalProfileAffinity(row.party, lane, baseline, state, options),
      }));
      const total = weighted.reduce((sum, row) => sum + row.weight, 0) || 1;
      weighted.forEach(row => rows.push({ party:row.party, pct:laneShares[lane] * row.weight / total }));
    });
    return finalizeRaceShares(rows, state, options);
  }

  function finalizeRaceShares(rows, state, options = {}) {
    const total = rows.reduce((sum, row) => sum + row.pct, 0) || 1;
    const normalized = rows.map(row => ({ party:row.party, pct:row.pct / total * 100 }));
    const profileAdjusted = applyStateProfileSwing(normalized, state, options);
    const strongholdAdjusted = applyStrongholdBoost(profileAdjusted, state, options);
    return strongholdAdjusted.sort((a, b) => b.pct - a.pct);
  }

  function applyStateProfileSwing(shares, state, options = {}) {
    if (shares.length < 2) return shares;
    const baseline = baselineForRace(state, options);
    const twoPartyTotal = Math.max(0.01, Number(baseline.demPct) + Number(baseline.gopPct));
    const partisanSignal = clamp((Number(baseline.demPct) - Number(baseline.gopPct)) / twoPartyTotal * 2.4, -1, 1, 0);
    const urban = options.county?.urban ?? state.urban;
    const urbanSignal = clamp((Number(urban) + app.settings.urbanTurnout - 50) / 50, -1, 1, 0);
    const socialTerrain = clamp(partisanSignal * 0.72 + urbanSignal * 0.28, -1, 1, 0);
    const economicTerrain = clamp(partisanSignal * 0.82 + urbanSignal * 0.18, -1, 1, 0);
    const laneCount = new Set(shares.filter(row => row.pct > 0.05).map(row => partyLane(row.party))).size;
    const sameLaneContest = laneCount === 1;
    const strength = options.county
      ? 0.23
      : options.district
        ? (sameLaneContest ? 0.27 : 0.19)
        : options.senateSeat
          ? (sameLaneContest ? 0.22 : 0.18)
          : 0.21;
    const adjusted = shares.map(row => {
      const social = (clamp(row.party.social, 0, 100, 50) - 50) / 50;
      const stateEconomy = (clamp(row.party.economic, 0, 100, 50) - 50) / 50;
      const compatibility = social * socialTerrain * 0.56 + stateEconomy * economicTerrain * 0.44;
      const culture = stateProfileCultureScore(row.party, state, options, baseline);
      const cultureStrength = options.county ? 0.16 : options.district ? 0.20 : options.senateSeat ? 0.19 : 0.18;
      return { ...row, pct:row.pct * Math.exp(compatibility * strength + culture * cultureStrength) };
    });
    const adjustedTotal = adjusted.reduce((sum, row) => sum + row.pct, 0) || 1;
    return adjusted.map(row => ({ ...row, pct:row.pct / adjustedTotal * 100 }));
  }

  function applyStrongholdBoost(shares, state, options = {}) {
    const chamberRace = !!(options.district || options.senateSeat);
    const pointScale = options.senateSeat ? 0.85 : options.district ? 0.95 : options.county ? 0.34 : 0.42;
    const boostRows = shares
      .map(row => ({
        row,
        add: Math.max(0, Number(row.party.strongholds?.[state.abbr]) || 0) * pointScale,
      }))
      .filter(item => item.add > 0);
    if (!boostRows.length) return shares;
    const boostedIds = new Set(boostRows.map(item => item.row.party.id));
    const donorPool = shares
      .filter(row => !boostedIds.has(row.party.id))
      .reduce((sum, row) => sum + row.pct, 0);
    const requestedAdd = boostRows.reduce((sum, item) => sum + item.add, 0);
    const cap = donorPool > 0
      ? Math.min(chamberRace ? 16 : 10, donorPool * (chamberRace ? 0.38 : 0.25))
      : chamberRace ? 12 : 8;
    const scale = requestedAdd > cap ? cap / requestedAdd : 1;
    const addByParty = new Map(boostRows.map(item => [item.row.party.id, item.add * scale]));
    const totalAdd = [...addByParty.values()].reduce((sum, value) => sum + value, 0);
    if (totalAdd <= 0) return shares;
    if (donorPool <= 0) {
      const raw = shares.map(row => ({ ...row, pct:row.pct + (addByParty.get(row.party.id) || 0) }));
      const rawTotal = raw.reduce((sum, row) => sum + row.pct, 0) || 1;
      return raw.map(row => ({ ...row, pct:row.pct / rawTotal * 100 }));
    }
    return shares.map(row => {
      const add = addByParty.get(row.party.id) || 0;
      const take = boostedIds.has(row.party.id) ? 0 : totalAdd * (row.pct / donorPool);
      return { ...row, pct:clamp(row.pct + add - take, 0, 100) };
    });
  }

  function applyRaceEdit(shares, edit) {
    if (!edit?.shares) return shares;
    const byParty = new Map(shares.map(row => [row.party.id, row.pct]));
    Object.entries(edit.shares).forEach(([partyId, value]) => {
      if (byParty.has(partyId)) byParty.set(partyId, clamp(value, 0, 100, 0));
    });
    const rawTotal = [...byParty.values()].reduce((sum, value) => sum + Math.max(0, value), 0);
    if (rawTotal <= 0) return shares;
    return shares.map(row => ({
      party:row.party,
      pct: Math.max(0, byParty.get(row.party.id) || 0) / rawTotal * 100,
    })).sort((a, b) => b.pct - a.pct);
  }

  function addVoteCounts(shares, totalVotes) {
    const total = Math.max(1, Number(totalVotes) || 1);
    return shares.map(row => ({ ...row, votes:Math.round(total * row.pct / 100) }));
  }

  function raceEdit(kind, id) {
    const bucket = raceEditBucket(kind);
    return app.resultEdits?.[bucket]?.[id] || null;
  }

  function setRaceEdit(kind, id, shares) {
    const bucketName = raceEditBucket(kind);
    app.resultEdits = normalizeResultEdits(app.resultEdits);
    if (kind === 'senate') {
      Object.keys(app.resultEdits.senateSeats).forEach(key => {
        if (key.startsWith(`${id}:`)) delete app.resultEdits.senateSeats[key];
      });
    }
    const normalized = {};
    Object.entries(shares || {}).forEach(([partyId, value]) => {
      if (app.parties.some(party => party.id === partyId)) normalized[partyId] = clamp(value, 0, 100, 0);
    });
    app.resultEdits[bucketName][id] = { shares:normalized };
    invalidateElectionResults();
  }

  function clearRaceEdit(kind, id) {
    const bucketName = raceEditBucket(kind);
    if (app.resultEdits?.[bucketName] && app.resultEdits[bucketName][id]) {
      delete app.resultEdits[bucketName][id];
      invalidateElectionResults();
    }
  }

  function relatedRaceEditEntries(kind, id) {
    const edits = normalizeResultEdits(app.resultEdits);
    const entries = [];
    const add = (bucket, key) => {
      if (edits[bucket]?.[key]) entries.push({ bucket, key });
    };
    add(raceEditBucket(kind), id);
    if (kind === 'senate') {
      Object.keys(edits.senateSeats).forEach(key => {
        if (key.startsWith(`${id}:`)) add('senateSeats', key);
      });
    }
    if (kind === 'state') {
      Object.keys(edits.electoralUnits).forEach(key => {
        if (key === `${id} statewide` || key.startsWith(`${id}-`)) add('electoralUnits', key);
      });
    }
    return entries;
  }

  function clearRelatedRaceEdits(kind, id) {
    const entries = relatedRaceEditEntries(kind, id);
    if (!entries.length) return false;
    app.resultEdits = normalizeResultEdits(app.resultEdits);
    entries.forEach(({ bucket, key }) => delete app.resultEdits[bucket][key]);
    invalidateElectionResults();
    return true;
  }

  function modeRaceEditBuckets(mode = app.electionMode) {
    if (mode === 'house') return ['districts'];
    if (mode === 'senate') return ['senateStates', 'senateSeats'];
    return ['states', 'counties', 'electoralUnits'];
  }

  function modeRaceEditCount(mode = app.electionMode) {
    const edits = normalizeResultEdits(app.resultEdits);
    return modeRaceEditBuckets(mode).reduce(
      (sum, bucket) => sum + Object.keys(edits[bucket] || {}).length,
      0
    );
  }

  function clearModeRaceEdits(mode = app.electionMode) {
    if (!modeRaceEditCount(mode)) return false;
    app.resultEdits = normalizeResultEdits(app.resultEdits);
    modeRaceEditBuckets(mode).forEach(bucket => {
      app.resultEdits[bucket] = {};
    });
    invalidateElectionResults();
    return true;
  }

  function raceEditBucket(kind) {
    if (kind === 'county') return 'counties';
    if (kind === 'district') return 'districts';
    if (kind === 'electoral-unit') return 'electoralUnits';
    if (kind === 'senate') return 'senateStates';
    if (kind === 'senate-seat') return 'senateSeats';
    return 'states';
  }

  function raceTotalVotes(state, options = {}) {
    const county = options.county;
    const district = options.district;
    if (district) return Math.max(1, Number(district.total) || 520000);
    if (county) return countyVoteTotal(state, county);
    return Math.max(1, baselineForRace(state, options).total || fallbackStateVoteTotal(state));
  }

  function fallbackStateVoteTotal(state) {
    return Math.max(1, (Number(state?.ev) || 1) * 100000);
  }

  function stateVoteTotal(state) {
    return Math.max(1, Number(baselineStateByAbbr.get(state.abbr)?.total) || fallbackStateVoteTotal(state));
  }

  function countyVoteTotal(state, county) {
    const direct = Number(county?.baseline?.total);
    if (Number.isFinite(direct) && direct > 0) return direct;
    const stateTotal = stateVoteTotal(state);
    const shapes = countiesByState.get(state.abbr) || [];
    if (!shapes.length) return stateTotal;
    let knownTotal = 0;
    let missingCount = 0;
    shapes.forEach(shape => {
      const baseline = baselineCountyById.get(String(shape.id).padStart(5, '0'));
      const total = Number(baseline?.total);
      if (Number.isFinite(total) && total > 0) knownTotal += total;
      else missingCount += 1;
    });
    if (!missingCount) return Math.max(1, stateTotal / shapes.length);
    const remaining = stateTotal - knownTotal;
    return Math.max(1, remaining > 0 ? remaining / missingCount : stateTotal / shapes.length);
  }

  function blocRows(shares) {
    const map = new Map();
    shares.forEach(row => {
      if (!row.party.bloc) return;
      const key = row.party.bloc;
      const config = findBloc(key);
      const bloc = map.get(key) || {
        key,
        name:key,
        pct:0,
        color:blocColor(key, row.party.color),
        mode:config?.mode || 'electoral',
        party:row.party,
        memberCount:0,
        members:[],
      };
      bloc.pct += row.pct;
      bloc.memberCount += 1;
      bloc.members.push(row);
      if (!bloc.leadPct || row.pct > bloc.leadPct) {
        bloc.leadPct = row.pct;
        bloc.party = row.party;
      }
      map.set(key, bloc);
    });
    map.forEach(bloc => bloc.members.sort((a, b) => b.pct - a.pct));
    return [...map.values()].sort((a, b) => b.pct - a.pct);
  }

  function blocContestRows(shares) {
    const rows = [];
    const usedPartyIds = new Set();
    blocRows(shares).filter(bloc => bloc.memberCount > 1 && bloc.mode === 'electoral').forEach(bloc => {
      shares.filter(row => row.party.bloc === bloc.key).forEach(row => usedPartyIds.add(row.party.id));
      rows.push({ ...bloc, type:'bloc' });
    });
    shares.forEach(row => {
      if (usedPartyIds.has(row.party.id)) return;
      rows.push({
        key: row.party.id,
        name: row.party.party,
        pct: row.pct,
        color: row.party.color,
        party: row.party,
        type:'party',
      });
    });
    return rows.sort((a, b) => b.pct - a.pct);
  }

  function winnerForShares(shares) {
    if (app.settings.coalitionMode) {
      const contestRows = blocContestRows(shares);
      const lead = contestRows[0];
      const runner = contestRows[1];
      if (lead) {
        return {
          party: lead?.party || shares[0]?.party,
          key: lead?.key || shares[0]?.party.id,
          label: lead?.type === 'bloc' ? (lead?.name || lead?.key || '') : (lead?.party?.short || lead?.party?.party || ''),
          color: lead?.color || lead?.party?.color || '#64748b',
          pct: lead?.pct || 0,
          margin: (lead?.pct || 0) - (runner?.pct || 0),
          members: lead?.members || [{ party:lead?.party, pct:lead?.pct || 0 }],
          mode:lead?.type === 'bloc' ? 'bloc' : 'party',
        };
      }
    }
    return {
      party: shares[0]?.party,
      key: shares[0]?.party.id,
      label: shares[0]?.party.short || shares[0]?.party.party || '',
      color: shares[0]?.party.color || '#64748b',
      pct: shares[0]?.pct || 0,
      margin: (shares[0]?.pct || 0) - (shares[1]?.pct || 0),
      members:[shares[0]],
      mode:'party',
    };
  }

  const STATE_CALL_BASE = {
    VT:10, KY:11, IN:12, SC:18, AL:19, MS:20, OK:20, TN:21, WV:21, MA:22, MD:22, DC:22, RI:24, CT:25, DE:26, NJ:28,
    AR:30, MO:32, IL:33, ME:36, NH:44, FL:63, GA:78, NC:72, OH:56, PA:82, MI:78, WI:80, MN:61, IA:58,
    TX:66, KS:47, LA:48, NE:49, SD:50, ND:50, CO:57, NM:58, WY:60, NY:62, AZ:84, MT:70, UT:72, NV:88,
    ID:74, CA:66, OR:73, WA:75, HI:90, AK:94, VA:55,
  };

  function callThresholdForState(result) {
    const state = result.state;
    const base = STATE_CALL_BASE[state.abbr] ?? 62;
    const margin = result.winner.margin;
    const safetyAdjustment = margin > 25 ? -14 : margin > 15 ? -9 : margin > 8 ? -5 : margin < 2 ? 12 : margin < 5 ? 6 : 0;
    return clamp(base + safetyAdjustment, 4, 98);
  }

  function callThresholdForCounty(county, state, result) {
    const base = STATE_CALL_BASE[state.abbr] ?? 62;
    const h = hashNumber(`${county.id}:call`);
    const total = county.baseline?.total || 50000;
    const sizeDelay = clamp(Math.log10(Math.max(1000, total)) * 6 - 18, 0, 18);
    const closeDelay = result.winner.margin < 3 ? 12 : result.winner.margin < 8 ? 6 : 0;
    const earlySpread = (h - 0.5) * 34;
    return clamp(base - 22 + earlySpread + sizeDelay + closeDelay, 2, 99);
  }

  function callThresholdForDistrict(district, result) {
    const base = STATE_CALL_BASE[district.state] ?? 62;
    const h = hashNumber(`${district.id}:house-call`);
    const closeDelay = result.winner.margin < 2 ? 18 : result.winner.margin < 5 ? 10 : result.winner.margin < 9 ? 5 : 0;
    const safeRush = result.winner.margin > 22 ? -13 : result.winner.margin > 14 ? -8 : result.winner.margin > 8 ? -4 : 0;
    const localSpread = (h - 0.5) * 26;
    return clamp(base + localSpread + closeDelay + safeRush, 3, 99);
  }

  function stateResult(state, options = {}) {
    const raceState = options.district ? districtRaceState(options.district) : state;
    const isSplitUnit = !!(options.district || Number.isFinite(Number(options.unitLean)) || options.ev);
    const countyBased = !isSplitUnit ? stateSharesFromCounties(state) : null;
    const edit = isSplitUnit
      ? raceEdit('electoral-unit', String(options.label || state.abbr))
      : raceEdit('state', state.abbr);
    const rawShares = countyBased?.shares || raceShares(raceState, options);
    const totalVotes = countyBased?.totalVotes || raceTotalVotes(raceState, options);
    const shares = addVoteCounts(applyRaceEdit(rawShares, edit), totalVotes);
    const result = {
      kind:isSplitUnit ? 'electoral-unit' : 'state',
      state,
      shares,
      blocs: blocRows(shares),
      winner: winnerForShares(shares),
      ev: options.ev || state.ev,
      label: options.label || state.abbr,
      countyReportingPct: countyBased?.reportingPct ?? 0,
      totalVotes,
      edited: !!edit,
    };
    result.callThreshold = callThresholdForState(result);
    result.called = app.settings.reporting >= result.callThreshold && (result.countyReportingPct >= 54 || app.settings.reporting >= 96 || !countyBased);
    return result;
  }

  function stateSharesFromCounties(state) {
    const counties = countiesByState.get(state.abbr) || [];
    if (!counties.length) return null;
    const totals = new Map(
      app.parties
        .filter(party => partyRunsInState(party, state))
        .map(party => [party.id, { party, votes:0 }])
    );
    let totalVotes = 0;
    let calledVotes = 0;
    counties.forEach(countyShape => {
      const row = countyResult(countyShape, state);
      const weight = Math.max(1, Number(row.totalVotes) || countyVoteTotal(state, row.county));
      totalVotes += weight;
      if (row.called) calledVotes += weight;
      row.shares.forEach(share => {
        const total = totals.get(share.party.id);
        if (total) total.votes += weight * share.pct / 100;
      });
    });
    const shares = [...totals.values()]
      .map(row => ({ party:row.party, pct:row.votes / Math.max(1, totalVotes) * 100 }))
      .sort((a, b) => b.pct - a.pct);
    return { shares, reportingPct:calledVotes / Math.max(1, totalVotes) * 100, totalVotes };
  }

  function countyProfile(county, state) {
    const baseline = baselineCountyById.get(String(county.id).padStart(5, '0'));
    const h = hashNumber(`${county.id}:${county.name}`);
    const [x1, y1, x2, y2] = county.bbox || [0, 0, 1, 1];
    const areaSignal = Math.max(0.2, Math.sqrt(Math.abs((x2 - x1) * (y2 - y1))));
    const baselineUrban = baseline
      ? clamp(50 + (baseline.demPct - baseline.gopPct) * 0.72 + (h - 0.5) * 10, 18, 98, state.urban)
      : state.urban;
    let urban = clamp(baselineUrban + (h - 0.5) * 12 - areaSignal * 0.08, 18, 98, state.urban);
    if (/(Los Angeles|San Francisco|Alameda|Santa Clara|King|Multnomah|Cook|Philadelphia|Wayne|Washtenaw|Hennepin|Fulton|DeKalb|Fairfax|Arlington|Prince George|Montgomery|Baltimore|Kings|Queens|Bronx|Denver|Boulder|Clark|Dane|Milwaukee|Durham|Wake|Mecklenburg|Orleans|Broward|Dallas|Harris|Travis|Bexar|Salt Lake|Providence|Honolulu)/i.test(county.name)) {
      urban = Math.max(urban, 82);
    }
    const lean = baseline ? (baseline.gopPct - baseline.demPct) / 4 : (50 - urban) * 0.20 + (h - 0.5) * 7;
    return { ...county, name: baseline?.name || county.name, urban, lean, baseline };
  }

  function countyResult(county, state) {
    const profile = countyProfile(county, state);
    const edit = raceEdit('county', String(profile.id));
    const totalVotes = raceTotalVotes(state, { county:profile, label:county.name });
    const shares = addVoteCounts(applyRaceEdit(raceShares(state, { county:profile, label:county.name }), edit), totalVotes);
    const result = { county:profile, state, shares, blocs:blocRows(shares), winner:winnerForShares(shares), totalVotes, edited:!!edit };
    result.callThreshold = callThresholdForCounty(profile, state, result);
    result.called = app.settings.reporting >= result.callThreshold;
    return result;
  }

  function districtRaceState(district) {
    const state = stateByAbbr.get(district.state) || stateByAbbr.get('PA');
    const districtLean = Number(district.lean);
    return {
      ...state,
      lean: Number.isFinite(districtLean) ? districtLean : state.lean,
      urban: districtUrbanValue(district, state),
      ev: 1,
    };
  }

  function districtUrbanValue(district, state) {
    const rawUrban = clamp(district.urban, 10, 99, state.urban);
    const pvi = Number(district.pviValue);
    if (!Number.isFinite(pvi)) return rawUrban;
    const pviUrban = clamp(50 - pvi * 0.95, 24, 86, rawUrban);
    const pviWeight = Math.abs(pvi) >= 8 ? 0.72 : 0.55;
    return clamp(rawUrban * (1 - pviWeight) + pviUrban * pviWeight, 16, 96, rawUrban);
  }

  function houseResult(district) {
    const state = districtRaceState(district);
    const edit = raceEdit('district', district.id);
    const totalVotes = raceTotalVotes(state, { district, label:district.label });
    const shares = addVoteCounts(applyRaceEdit(raceShares(state, { district, label:district.label }), edit), totalVotes);
    const result = {
      kind:'district',
      district,
      state,
      shares,
      blocs: blocRows(shares),
      winner: winnerForShares(shares),
      ev: 1,
      label: district.label,
      totalVotes,
      edited: !!edit,
    };
    result.callThreshold = callThresholdForDistrict(district, result);
    result.called = app.settings.reporting >= result.callThreshold;
    return result;
  }

  function senateDelegation(state) {
    const fallbackSide = state.lean <= -3 ? 'left' : state.lean >= 3 ? 'right' : 'center';
    const rows = SENATE_DELEGATIONS[state.abbr] || [
      [`${state.abbr} Class 1`, 1, fallbackSide],
      [`${state.abbr} Class 2`, 2, fallbackSide],
    ];
    return rows.map(([name, cls, side, margin, candidateNames], index) => {
      const seatMargin = Number.isFinite(Number(margin)) ? Number(margin) : null;
      const names = normalizeSenateCandidateNames(name, side, seatMargin, candidateNames);
      return {
        name,
        class:cls,
        side,
        margin:seatMargin,
        demName:names.demName,
        repName:names.repName,
        index,
        label:`Class ${cls}`,
      };
    });
  }

  function normalizeSenateCandidateNames(name, side, margin, candidateNames = {}) {
    const explicit = candidateNames && typeof candidateNames === 'object' ? candidateNames : {};
    const isSafe = Number.isFinite(margin) && Math.abs(margin) >= 35;
    let demName = String(explicit.dem || '').trim();
    let repName = String(explicit.rep || '').trim();
    if (!demName && side === 'left') demName = name;
    if (!repName && side === 'right') repName = name;
    if (!demName && side === 'center' && Number.isFinite(margin) && margin < 0) demName = name;
    if (!repName && side === 'center' && Number.isFinite(margin) && margin > 0) repName = name;
    if (!isSafe) {
      demName ||= 'Democratic nominee';
      repName ||= 'Republican nominee';
    }
    return { demName, repName };
  }

  function senateSeatResult(state, seat, edit) {
    const label = `${state.abbr} Class ${seat.class}`;
    const options = { senateSeat:seat, label };
    const totalVotes = raceTotalVotes(state, options);
    const shares = addVoteCounts(applyRaceEdit(raceShares(state, options), edit), totalVotes);
    const result = {
      kind:'senate-seat',
      state,
      senateSeat:seat,
      shares,
      blocs: blocRows(shares),
      winner: winnerForShares(shares),
      ev:1,
      label,
      totalVotes,
      edited: !!edit,
      countyReportingPct: 0,
    };
    const seatDelay = seat.index * 2 + (seat.class === 2 ? 1 : 0);
    result.callThreshold = clamp(callThresholdForState(result) + seatDelay, 4, 99);
    result.called = app.settings.reporting >= result.callThreshold;
    return result;
  }

  function mergeSeatShares(seatResults) {
    const totalVotes = seatResults.reduce((sum, row) => sum + Math.max(1, row.totalVotes || 1), 0) || 1;
    const eligibleParties = app.parties.filter(party => seatResults.some(result => result.shares.some(row => row.party.id === party.id)));
    return eligibleParties.map(party => {
      const votes = seatResults.reduce((sum, row) => {
        const share = row.shares.find(item => item.party.id === party.id);
        return sum + (share?.votes || 0);
      }, 0);
      return { party, votes, pct:votes / totalVotes * 100 };
    }).sort((a, b) => b.pct - a.pct);
  }

  function calculateElectionMode(mode) {
    const normalizedMode = mode === 'house' || mode === 'senate' ? mode : 'president';
    const cached = electionResultCache.get(normalizedMode);
    if (cached?.revision === electionResultRevision) return cached.result;
    const result = normalizedMode === 'house'
      ? calculateHouseElection()
      : normalizedMode === 'senate'
      ? calculateSenateElection()
      : calculatePresidentElection();
    electionResultCache.set(normalizedMode, { revision:electionResultRevision, result });
    return result;
  }

  function calculateElection() {
    return calculateElectionMode(app.electionMode);
  }

  function calculatePresidentElection() {
    const partyTotals = new Map(app.parties.map(party => [party.id, {
      party,
      ev:0,
      states:0,
      popularWeight:0,
    }]));
    const stateResults = STATE_META.map(state => stateResult(state));
    const unitResults = [];
    let totalWeight = 0;

    stateResults.forEach(result => {
      const state = result.state;
      const units = SPLIT_EV[state.abbr];
      if (!units) {
        unitResults.push({ ...result, label:state.abbr, ev:state.ev });
        const total = result.winner.party ? partyTotals.get(result.winner.party.id) : null;
        if (total && result.called) total.ev += state.ev;
      } else {
        units.forEach(unit => {
          const district = houseDistrictById.get(splitEvDistrictId(unit.label));
          const statewideUnit = unit.label.endsWith(' statewide');
          const unitResult = stateResult(state, {
            label:unit.label,
            ev:unit.ev,
            district,
            unitLean:!district && !statewideUnit ? unit.lean : undefined,
          });
          unitResult.called = result.called && unitResult.called;
          unitResults.push(unitResult);
          const total = unitResult.winner.party ? partyTotals.get(unitResult.winner.party.id) : null;
          if (total && unitResult.called) total.ev += unit.ev;
        });
      }
      const winnerTotal = result.winner.party ? partyTotals.get(result.winner.party.id) : null;
      if (winnerTotal && result.called) winnerTotal.states += 1;
      const weight = Math.max(1, Number(result.totalVotes) || stateVoteTotal(state));
      totalWeight += weight;
      result.shares.forEach(row => {
        const total = partyTotals.get(row.party.id);
        if (total) total.popularWeight += weight * row.pct / 100;
      });
    });

    const parties = [...partyTotals.values()].map(row => ({
      ...row,
      popularPct: row.popularWeight / Math.max(1, totalWeight) * 100,
      popularVotes: row.popularWeight / Math.max(1, totalWeight) * TOTAL_POPULAR_VOTES,
    })).sort((a, b) => b.ev - a.ev || b.popularPct - a.popularPct);

    return {
      mode:'president',
      totalUnits:538,
      majority:270,
      unitLabel:'points',
      mapLabel:'Electoral count',
      battleLabel:'Closest called states',
      parties,
      stateResults,
      unitResults,
      leader: parties[0],
      battlegrounds: battlegrounds(stateResults),
      tipping: tippingPoint(unitResults, parties[0]?.party.id),
    };
  }

  function calculateHouseElection() {
    const partyTotals = new Map(app.parties.map(party => [party.id, {
      party,
      ev:0,
      states:0,
      popularVotes:0,
      popularWeight:0,
    }]));
    const districtResults = houseDistricts.map(district => houseResult(district));
    let totalVotes = 0;
    districtResults.forEach(result => {
      if (result.called && result.winner.party) {
        const total = partyTotals.get(result.winner.party.id);
        if (total) {
          total.ev += 1;
          total.states += 1;
        }
      }
      totalVotes += Math.max(1, result.totalVotes || 1);
      result.shares.forEach(share => {
        const total = partyTotals.get(share.party.id);
        if (total) total.popularVotes += (result.totalVotes || 1) * share.pct / 100;
      });
    });
    const parties = [...partyTotals.values()].map(row => ({
      ...row,
      popularPct: row.popularVotes / Math.max(1, totalVotes) * 100,
    })).sort((a, b) => b.ev - a.ev || b.popularPct - a.popularPct);
    return {
      mode:'house',
      totalUnits:HOUSE_SEATS,
      majority:218,
      unitLabel:'seats',
      mapLabel:'House seat count',
      battleLabel:'Closest called districts',
      parties,
      districtResults,
      stateResults:[],
      unitResults:districtResults,
      leader: parties[0],
      battlegrounds: battlegrounds(districtResults),
      tipping: tippingPoint(districtResults, parties[0]?.party.id, 218),
    };
  }

  function senateResult(state) {
    const stateEdit = raceEdit('senate', state.abbr);
    const seatResults = senateDelegation(state).map(seat => {
      const seatEdit = raceEdit('senate-seat', `${state.abbr}:${seat.class}`);
      return senateSeatResult(state, seat, seatEdit || stateEdit);
    });
    const totalVotes = seatResults.reduce((sum, row) => sum + Math.max(1, row.totalVotes || 1), 0);
    const shares = mergeSeatShares(seatResults);
    const winner = winnerForShares(shares);
    const calledSeatKeys = new Set(seatResults.filter(row => row.called && row.winner.key).map(row => row.winner.key));
    const result = {
      kind:'senate',
      state,
      shares,
      blocs: blocRows(shares),
      winner,
      seatResults,
      seatWinners: seatResults.map(row => row.winner.party).filter(Boolean),
      splitSeats: calledSeatKeys.size > 1,
      ev: 2,
      label: state.abbr,
      totalVotes,
      edited: !!stateEdit || seatResults.some(seat => seat.edited),
      countyReportingPct: 0,
    };
    result.callThreshold = Math.max(...seatResults.map(row => row.callThreshold || 0));
    result.called = seatResults.every(row => row.called);
    return result;
  }

  function calculateSenateElection() {
    const partyTotals = new Map(app.parties.map(party => [party.id, {
      party,
      ev:0,
      states:0,
      popularVotes:0,
      popularWeight:0,
    }]));
    const senateResults = SENATE_STATE_META.map(state => senateResult(state));
    const senateUnitResults = [];
    let totalVotes = 0;
    senateResults.forEach(result => {
      (result.seatResults || []).forEach(seatResult => {
        totalVotes += Math.max(1, seatResult.totalVotes || 1);
        seatResult.shares.forEach(share => {
          const total = partyTotals.get(share.party.id);
          if (total) total.popularVotes += (seatResult.totalVotes || 1) * share.pct / 100;
        });
        if (seatResult.called && seatResult.winner.party) {
          const total = partyTotals.get(seatResult.winner.party.id);
          if (total) {
            total.ev += 1;
            total.states += 1;
          }
          senateUnitResults.push(seatResult);
        }
      });
    });
    let parties = [...partyTotals.values()].map(row => ({
      ...row,
      popularPct: row.popularVotes / Math.max(1, totalVotes) * 100,
    })).sort((a, b) => b.ev - a.ev || b.popularPct - a.popularPct);
    const vpTieBreakParty = senateVpTieBreakParty(parties);
    if (vpTieBreakParty) {
      parties = parties.map(row => ({
        ...row,
        vpTieBreak: row.party.id === vpTieBreakParty.id,
      })).sort((a, b) => (b.ev + (b.vpTieBreak ? 1 : 0)) - (a.ev + (a.vpTieBreak ? 1 : 0)) || b.popularPct - a.popularPct);
    }
    return {
      mode:'senate',
      totalUnits:SENATE_SEATS,
      majority:51,
      unitLabel:'seats',
      mapLabel:'Senate seat count',
      battleLabel:'Closest called Senate seats',
      parties,
      senateResults,
      stateResults:senateResults,
      unitResults:senateUnitResults,
      leader: parties[0],
      battlegrounds: battlegrounds(senateUnitResults),
      tipping: tippingPoint(senateUnitResults, parties[0]?.party.id, 51),
      vpTieBreakParty,
    };
  }

  function senateVpTieBreakParty(parties) {
    const calledSeats = parties.reduce((sum, row) => sum + (Number(row.ev) || 0), 0);
    if (calledSeats !== SENATE_SEATS || parties.some(row => (Number(row.ev) || 0) >= 51)) return null;
    const presidentialParty = presidentialWinnerForSenateTie();
    const presidentialRow = parties.find(row => row.party.id === presidentialParty?.id);
    return presidentialRow && Number(presidentialRow.ev) === 50 ? presidentialParty : null;
  }

  function presidentialWinnerForSenateTie() {
    const originalReporting = app.settings.reporting;
    app.settings.reporting = 100;
    const result = calculatePresidentElection();
    app.settings.reporting = originalReporting;
    return result.parties[0]?.party || null;
  }

  function calculateGovernmentAssembly(currentResult = null, electionSnapshot = null) {
    const president = currentResult?.mode === 'president' ? currentResult : (electionSnapshot?.president || calculateElectionMode('president'));
    const house = currentResult?.mode === 'house' ? currentResult : (electionSnapshot?.house || calculateElectionMode('house'));
    const senate = currentResult?.mode === 'senate' ? currentResult : (electionSnapshot?.senate || calculateElectionMode('senate'));
    const complete = app.settings.reporting >= 100;
    const presidentDecision = governmentPresidentDecision(president, house);
    const viceDecision = governmentViceDecision(president, senate, presidentDecision);
    const roles = governmentRoleSets(presidentDecision);
    const seatRows = governmentSeatRows(house, senate, roles);
    const agenda = GOVERNMENT_AGENDA.find(item => item.key === app.government.agenda) || GOVERNMENT_AGENDA[0];
    const votes = governmentAgendaVotes(agenda, seatRows, roles, presidentDecision, viceDecision);
    return { complete, president, house, senate, presidentDecision, viceDecision, roles, seatRows, agenda, votes };
  }

  function governmentFormationState(assembly) {
    const president = assembly.presidentDecision.party || null;
    const vicePresident = assembly.viceDecision.party || null;
    const presidentInCabinet = !!president && assembly.roles.cabinetIds.includes(president.id);
    const formed = !!president && !!vicePresident && presidentInCabinet;
    const governingSeats = chamberRoleTotals(assembly.seatRows, 'governing');
    const vpSupportsGovernment = !!vicePresident && assembly.roles.governingIds.includes(vicePresident.id);
    const effectiveSenate = governingSeats.senate + (vpSupportsGovernment && governingSeats.senate === 50 ? 1 : 0);
    const houseMajority = governingSeats.house >= 218;
    const senateMajority = effectiveSenate >= 51;
    const congressionalLabel = houseMajority && senateMajority
      ? 'Unified congressional majority'
      : houseMajority
      ? 'House majority · Senate minority'
      : senateMajority
      ? 'Senate majority · House minority'
      : 'Minority administration';
    const accent = president?.bloc
      ? blocColor(president.bloc, president.color)
      : (president?.color || '#38bdf8');
    const key = formed
      ? `${president.id}:${vicePresident.id}:${[...assembly.roles.cabinetIds].sort().join(',')}`
      : '';
    return {
      formed,
      key,
      president,
      vicePresident,
      presidentInCabinet,
      completed: [!!president, !!vicePresident, presidentInCabinet].filter(Boolean).length,
      governingSeats,
      effectiveSenate,
      houseMajority,
      senateMajority,
      congressionalLabel,
      accent,
    };
  }

  function governmentFormationShouldAnimate(formation) {
    if (!governmentFormationInitialized) {
      governmentFormationInitialized = true;
      lastGovernmentFormationKey = formation.formed ? formation.key : '';
      return false;
    }
    const animate = formation.formed && formation.key !== lastGovernmentFormationKey;
    lastGovernmentFormationKey = formation.formed ? formation.key : '';
    return animate;
  }

  function governmentFormationMarkup(formation, celebrate) {
    const steps = [
      { label:'President', complete:!!formation.president },
      { label:'Vice President', complete:!!formation.vicePresident },
      { label:'Cabinet', complete:formation.presidentInCabinet },
    ];
    const summary = formation.formed
      ? `${formation.president.candidate || formation.president.party} and ${formation.vicePresident.candidate || formation.vicePresident.party} lead the administration.`
      : formation.president && !formation.presidentInCabinet
      ? `Assign ${formation.president.short} to the cabinet to complete the administration.`
      : 'The constitutional offices and cabinet are still being assembled.';
    return `
      <section class="government-formation ${formation.formed ? 'formed' : 'building'} ${celebrate ? 'celebrate' : ''}" style="--government-accent:${escapeAttr(formation.accent)}">
        <div class="government-formation-status">
          <span class="government-formation-mark" aria-hidden="true">
            ${formation.formed ? `
              <svg viewBox="0 0 32 32">
                <path class="government-formation-check" d="M8.2 16.4l5.1 5.2L24.1 10"></path>
              </svg>
            ` : `<b>${formation.completed}/3</b>`}
          </span>
          <div>
            <span class="government-mini-label">Administration status</span>
            <strong>${formation.formed ? 'Government formed' : 'Formation in progress'}</strong>
            <em>${escapeHtml(summary)}</em>
          </div>
        </div>
        <div class="government-formation-steps">
          ${steps.map(step => `
            <span class="${step.complete ? 'complete' : ''}">
              <i></i>
              ${escapeHtml(step.label)}
            </span>
          `).join('')}
        </div>
        <div class="government-congress-status">
          <span>Congressional footing</span>
          <strong>${escapeHtml(formation.congressionalLabel)}</strong>
          <em>${formation.governingSeats.house}/435 House · ${formation.governingSeats.senate}${formation.effectiveSenate > formation.governingSeats.senate ? '+VP' : ''}/100 Senate</em>
        </div>
        ${celebrate ? `
          <span class="government-confetti" aria-hidden="true">
            ${Array.from({ length:10 }, (_item, index) => `<i style="--index:${index}"></i>`).join('')}
          </span>
        ` : ''}
      </section>
    `;
  }

  function governmentPresidentDecision(president, house) {
    const electoralWinner = president.parties.find(row => Number(row.ev) >= president.majority);
    if (electoralWinner) {
      const finalists = [electoralWinner.party];
      const selected = governmentSelectedParty(app.government.presidentId, finalists);
      return {
        type:'electoral',
        party:selected,
        label:'Electoral College',
        status:selected
          ? `${selected.short} certified after ${electoralWinner.ev}/${president.totalUnits} electoral votes`
          : `No president selected yet · ${electoralWinner.party.short} is eligible to certify`,
        votes:selected ? electoralWinner.ev : 0,
        target:president.majority,
        finalists,
        suggested:electoralWinner.party,
        stateVotes:[],
        deadlocked:0,
      };
    }
    const finalists = president.parties.slice(0, 3).map(row => row.party).filter(Boolean);
    const ballot = contingentHouseBallot(house, finalists);
    const leader = ballot.rows[0];
    const selected = governmentSelectedParty(app.government.presidentId, finalists);
    const selectedRow = ballot.rows.find(row => row.party.id === selected?.id);
    return {
      type:'contingent',
      party:selected,
      label:'Contingent House election',
      status:selected
        ? `${selected.short} selected by House ballot · ${selectedRow?.votes || 0}/50 delegations`
        : `${leader?.party?.short || 'No party'} leads ${leader?.votes || 0}/50; choose a President`,
      votes:selectedRow?.votes || 0,
      target:26,
      finalists,
      suggested:leader?.party || null,
      stateVotes:ballot.stateVotes,
      rows:ballot.rows,
      deadlocked:ballot.deadlocked,
      unassigned:ballot.unassigned,
    };
  }

  function contingentHouseBallot(house, finalists = []) {
    const finalistIds = new Set(finalists.map(party => party.id));
    const totals = new Map(finalists.map(party => [party.id, { party, votes:0 }]));
    const stateVotes = [];
    STATE_META.filter(state => state.abbr !== 'DC').forEach(state => {
      const delegation = (house.districtResults || []).filter(row => row.district?.state === state.abbr);
      const districts = delegation.filter(row => row.called);
      const needed = Math.floor(delegation.length / 2) + 1;
      const counts = new Map();
      const controlCounts = new Map();
      let reassigned = 0;
      districts.forEach(row => {
        const representativeParty = row.winner.party;
        if (!representativeParty) return;
        const control = controlCounts.get(representativeParty.id) || { party:representativeParty, seats:0 };
        control.seats += 1;
        controlCounts.set(representativeParty.id, control);
        const choice = coalitionAwareFinalistChoice(representativeParty, finalists);
        if (!choice || !finalistIds.has(choice.id)) return;
        counts.set(choice.id, (counts.get(choice.id) || 0) + 1);
        if (choice.id !== representativeParty.id) reassigned += 1;
      });
      const ranked = finalists
        .map(party => ({ party, seats:counts.get(party.id) || 0 }))
        .sort((a, b) => b.seats - a.seats || partyAlignmentScore(a.party) - partyAlignmentScore(b.party));
      const autoTop = ranked[0];
      const autoTied = !autoTop || autoTop.seats < needed;
      const controlRanked = [...controlCounts.values()]
        .sort((a, b) => b.seats - a.seats || partyAlignmentScore(a.party) - partyAlignmentScore(b.party));
      const controlTop = controlRanked[0] || null;
      const controller = controlTop && controlTop.seats >= needed ? controlTop.party : null;
      const manualMode = app.government.delegationMode === 'manual';
      const overrideId = manualMode
        ? String(app.government.delegationVotes?.[state.abbr] || '')
        : '';
      const overrideParty = finalistIds.has(overrideId) ? findParty(overrideId) : null;
      const manuallyDeadlocked = overrideId === 'deadlock';
      const manualOverride = manuallyDeadlocked || !!overrideParty;
      const directParty = controller && finalistIds.has(controller.id) ? controller : null;
      const requiresAssignment = !directParty;
      const party = manuallyDeadlocked
        ? null
        : (overrideParty || (manualMode ? directParty : (!autoTied ? autoTop.party : null)));
      const unassigned = manualMode && !manualOverride && requiresAssignment;
      const deadlocked = manuallyDeadlocked || (!manualMode && !party);
      const tied = !party;
      if (!tied && totals.has(party.id)) totals.get(party.id).votes += 1;
      stateVotes.push({
        state,
        party,
        seats:party ? (counts.get(party.id) || 0) : (autoTop?.seats || 0),
        counted:districts.length,
        delegationSize:delegation.length,
        needed,
        reassigned,
        tied,
        unassigned,
        deadlocked,
        requiresAssignment,
        ranked,
        autoParty:autoTied ? null : autoTop.party,
        autoTied,
        controller,
        controllerSeats:controller ? (controlCounts.get(controller.id)?.seats || 0) : 0,
        controlLeader:controlTop?.party || null,
        controlRanked,
        manualOverride,
        overrideId:manualOverride ? overrideId : '',
      });
    });
    const rows = [...totals.values()].sort((a, b) => b.votes - a.votes || partyAlignmentScore(a.party) - partyAlignmentScore(b.party));
    return {
      rows,
      stateVotes,
      deadlocked:stateVotes.filter(row => row.deadlocked).length,
      unassigned:stateVotes.filter(row => row.unassigned).length,
    };
  }

  function governmentViceDecision(president, senate, presidentDecision) {
    if (presidentDecision.type === 'electoral') {
      const finalists = [presidentDecision.suggested || presidentDecision.party].filter(Boolean);
      const selected = governmentSelectedParty(app.government.vicePresidentId, finalists);
      return {
        type:'ticket',
        party:selected,
        label:'Electoral ticket',
        status:selected
          ? `${selected.short} ticket vice president selected`
          : `No vice president selected yet · ticket must be certified`,
        votes:selected ? presidentDecision.target : 0,
        target:presidentDecision.target,
        finalists,
        suggested:finalists[0] || null,
        rows:[],
      };
    }
    const finalists = president.parties.slice(0, 2).map(row => row.party).filter(Boolean);
    const ballot = senateViceBallot(senate, finalists);
    const leader = ballot.rows[0];
    const selected = governmentSelectedParty(app.government.vicePresidentId, finalists);
    const selectedRow = ballot.rows.find(row => row.party.id === selected?.id);
    return {
      type:'senate',
      party:selected,
      label:'Senate vice-presidential ballot',
      status:selected
        ? `${selected.short} selected by Senate ballot · ${selectedRow?.votes || 0}/100 senators`
        : `${leader?.party?.short || 'No party'} leads ${leader?.votes || 0}/100; choose a Vice President`,
      votes:selectedRow?.votes || 0,
      target:51,
      finalists,
      suggested:leader?.party || null,
      rows:ballot.rows,
      crossVotes:ballot.crossVotes,
    };
  }

  function governmentSelectedParty(id, finalists = []) {
    const party = findParty(id);
    if (!party) return null;
    return finalists.some(item => item?.id === party.id) ? party : null;
  }

  function senateViceBallot(senate, finalists = []) {
    const totals = new Map(finalists.map(party => [party.id, { party, votes:0 }]));
    const crossVotes = [];
    (senate.unitResults || []).filter(row => row.called && row.winner.party).forEach(row => {
      const senatorParty = row.winner.party;
      const choice = coalitionAwareFinalistChoice(senatorParty, finalists);
      if (choice && totals.has(choice.id)) {
        totals.get(choice.id).votes += 1;
        if (choice.id !== senatorParty.id) crossVotes.push({ from:senatorParty, to:choice, seat:row.label });
      }
    });
    const rows = [...totals.values()].sort((a, b) => b.votes - a.votes || partyAlignmentScore(a.party) - partyAlignmentScore(b.party));
    return { rows, crossVotes };
  }

  function closestPartyByIdeology(sourceParty, candidates = []) {
    return candidates
      .filter(Boolean)
      .map(party => ({ party, distance:partyDistance(sourceParty, party) }))
      .sort((a, b) => a.distance - b.distance || partyAlignmentScore(a.party) - partyAlignmentScore(b.party))[0]?.party || null;
  }

  function coalitionAwareFinalistChoice(sourceParty, candidates = []) {
    const finalists = candidates.filter(Boolean);
    const direct = finalists.find(party => party.id === sourceParty?.id);
    if (direct) return direct;
    const blocName = String(sourceParty?.bloc || '').toLowerCase();
    const coalitionFinalists = blocName
      ? finalists.filter(party => String(party.bloc || '').toLowerCase() === blocName)
      : [];
    return closestPartyByIdeology(sourceParty, coalitionFinalists.length ? coalitionFinalists : finalists);
  }

  function partyDistance(a, b) {
    return Math.hypot(
      (Number(a?.social) || 50) - (Number(b?.social) || 50),
      (Number(a?.economic) || 50) - (Number(b?.economic) || 50),
      ((Number(a?.geography) || 50) - (Number(b?.geography) || 50)) * 0.7,
      ((Number(a?.populism) || 50) - (Number(b?.populism) || 50)) * 0.55
    );
  }

  function governmentRoleSets(presidentDecision) {
    const valid = new Set(app.parties.map(party => party.id));
    const clean = ids => [...new Set(ids || [])].filter(id => valid.has(id));
    const expand = ids => governmentCoalitionMemberIds(clean(ids));
    const cabinetIds = expand(app.government.cabinetIds);
    const presidentId = presidentDecision.party?.id || '';
    const supportIds = expand(app.government.supportIds).filter(id => !cabinetIds.includes(id));
    const passiveIds = expand(app.government.passiveIds).filter(id => !cabinetIds.includes(id) && !supportIds.includes(id));
    return {
      cabinetIds,
      supportIds,
      passiveIds,
      governingIds:[...new Set([...cabinetIds, ...supportIds])],
      presidentId,
    };
  }

  function governmentSeatRows(house, senate, roles) {
    const houseByParty = new Map((house.parties || []).map(row => [row.party.id, row.ev || 0]));
    const senateByParty = new Map((senate.parties || []).map(row => [row.party.id, row.ev || 0]));
    const vpPartyId = app.government.vicePresidentId || '';
    return app.parties.map(party => {
      const role = roles.cabinetIds.includes(party.id) ? 'cabinet'
        : roles.supportIds.includes(party.id) ? 'support'
        : roles.passiveIds.includes(party.id) ? 'passive'
        : 'opposition';
      return {
        party,
        role,
        house:Number(houseByParty.get(party.id)) || 0,
        senate:Number(senateByParty.get(party.id)) || 0,
        vp:party.id === vpPartyId,
      };
    }).sort((a, b) => {
      const roleOrder = { cabinet:0, support:1, passive:2, opposition:3 };
      return roleOrder[a.role] - roleOrder[b.role]
        || (b.house + b.senate) - (a.house + a.senate)
        || partyAlignmentScore(a.party) - partyAlignmentScore(b.party);
    });
  }

  function governmentCoalitionMemberIds(ids = []) {
    const expanded = new Set();
    ids.forEach(id => {
      const party = findParty(id);
      if (!party) return;
      const members = party.bloc ? blocParties(party.bloc) : [];
      (members.length > 1 ? members : [party]).forEach(member => expanded.add(member.id));
    });
    return [...expanded];
  }

  function governmentRoleEntityKey(party) {
    if (!party?.bloc || blocParties(party.bloc).length < 2) return party?.id || '';
    return `bloc:${party.bloc}`;
  }

  function governmentBuilderRows(seatRows = []) {
    const groups = new Map();
    seatRows.forEach(row => {
      const grouped = row.party.bloc && blocParties(row.party.bloc).length > 1;
      const key = grouped ? `bloc:${row.party.bloc}` : `party:${row.party.id}`;
      const group = groups.get(key) || { key, rows:[], bloc:grouped ? findBloc(row.party.bloc) : null };
      group.rows.push(row);
      groups.set(key, group);
    });
    const roleOrder = { cabinet:0, support:1, passive:2, opposition:3 };
    return [...groups.values()].map(group => {
      const members = [...group.rows].sort((a, b) => (b.house + b.senate) - (a.house + a.senate)
        || partyAlignmentScore(a.party) - partyAlignmentScore(b.party));
      const lead = members[0];
      const coalition = members.length > 1;
      return {
        ...lead,
        entityId:coalition ? group.key : lead.party.id,
        type:coalition ? 'coalition' : 'party',
        coalitionName:coalition ? (group.bloc?.name || lead.party.bloc) : '',
        coalitionShort:coalition ? (group.bloc?.short || shortCode(lead.party.bloc)) : '',
        color:coalition ? (group.bloc?.color || blocColor(lead.party.bloc, lead.party.color)) : lead.party.color,
        members,
        house:members.reduce((sum, row) => sum + row.house, 0),
        senate:members.reduce((sum, row) => sum + row.senate, 0),
        vp:members.some(row => row.vp),
      };
    }).sort((a, b) => roleOrder[a.role] - roleOrder[b.role]
      || (b.house + b.senate) - (a.house + a.senate)
      || partyAlignmentScore(a.party) - partyAlignmentScore(b.party));
  }

  function governmentAgendaVotes(agenda, seatRows, roles, presidentDecision, viceDecision) {
    return ['house','senate'].map(chamber => chamberVoteEstimate(chamber, agenda, seatRows, roles, presidentDecision, viceDecision));
  }

  function chamberVoteEstimate(chamber, agenda, seatRows, roles, presidentDecision, viceDecision) {
    const total = chamber === 'house' ? HOUSE_SEATS : SENATE_SEATS;
    const threshold = agenda.supermajority ? Math.ceil(total * 2 / 3) : Math.floor(total / 2) + 1;
    const presidentParty = presidentDecision.party || null;
    let yes = 0;
    let no = 0;
    let abstain = 0;
    const partyVotes = seatRows.map(row => {
      const seats = row[chamber] || 0;
      const estimate = partyVoteShareForAgenda(row, agenda, presidentParty, chamber);
      const y = Math.min(seats, Math.round(seats * estimate.yes));
      const a = Math.min(seats - y, Math.round(seats * estimate.abstain));
      const n = seats - y - a;
      yes += y;
      no += n;
      abstain += a;
      return { ...row, yes:y, no:n, abstain:a, yesShare:estimate.yes };
    });
    const vpCanBreakTie = chamber === 'senate'
      && !agenda.supermajority
      && yes === no
      && viceDecision.party
      && roles.governingIds.includes(viceDecision.party.id);
    const effectiveYes = yes + (vpCanBreakTie ? 1 : 0);
    return {
      chamber,
      total,
      threshold,
      yes,
      no,
      abstain,
      vpCanBreakTie,
      passed: effectiveYes >= threshold,
      effectiveYes,
      partyVotes,
    };
  }

  function partyVoteShareForAgenda(row, agenda, presidentParty, chamber) {
    const distance = presidentParty ? partyDistance(row.party, presidentParty) : 70;
    const closeness = presidentParty ? clamp(1 - distance / 105, 0, 1, 0) : 0.25;
    const pressure = clamp(Number(agenda.difficulty) || 1, 1, 8, 3);
    const chamberBoost = chamber === 'senate' ? 0.02 : 0;
    let yes;
    let abstain = 0.01;
    if (row.role === 'cabinet') {
      yes = 0.94 - pressure * 0.012 + closeness * 0.04 + chamberBoost;
    } else if (row.role === 'support') {
      yes = 0.70 - pressure * 0.018 + closeness * 0.10 + chamberBoost;
      abstain = 0.04;
    } else if (row.role === 'passive') {
      yes = 0.18 + closeness * 0.16 + Number(agenda.bipartisan || 0);
      abstain = 0.48;
    } else {
      yes = Number(agenda.bipartisan || 0) + closeness * 0.12 - pressure * 0.006;
      abstain = 0.02 + (closeness > 0.72 ? 0.04 : 0);
    }
    if (agenda.key === 'immigration' && partyAlignmentScore(row.party) > 58) yes += row.role === 'opposition' ? 0.07 : 0.04;
    if (agenda.key === 'rights' && partyAlignmentScore(row.party) < 48) yes += row.role === 'opposition' ? 0.08 : 0.04;
    if (agenda.key === 'tax' && partyAlignmentScore(row.party) > 52) yes += 0.04;
    if (agenda.key === 'judges') abstain *= 0.4;
    if (agenda.supermajority && row.role === 'opposition') yes += closeness * 0.10;
    return {
      yes: clamp(yes, row.role === 'cabinet' ? 0.70 : 0, row.role === 'cabinet' ? 0.99 : 0.92, 0),
      abstain: clamp(abstain, 0, 0.70, 0),
    };
  }

  function governmentVotePassed(votes) {
    return votes.every(vote => vote.passed);
  }

  function tippingPoint(unitResults, partyId, majority = 270) {
    if (!partyId) return null;
    const wins = unitResults.filter(row => row.called && row.winner.party?.id === partyId).sort((a, b) => b.winner.margin - a.winner.margin);
    let ev = 0;
    for (const row of wins) {
      ev += row.ev;
      if (ev >= majority) return row;
    }
    return wins[wins.length - 1] || null;
  }

  function battlegrounds(results) {
    return results
      .filter(row => row.called && row.winner.margin < 10)
      .sort((a, b) => a.winner.margin - b.winner.margin)
      .slice(0, 8);
  }

  function buildShell() {
    if (document.getElementById('us-election-wrap')) return;
    const wrap = document.createElement('main');
    wrap.id = 'us-election-wrap';
    wrap.className = 'us-election-wrap';
    wrap.innerHTML = `
      <section class="election-topbar">
        <div>
          <span class="election-kicker">US election simulator</span>
          <h2>Election Map</h2>
        </div>
        <div class="election-top-actions">
          <button class="election-btn" data-action="mode-president">President</button>
          <button class="election-btn" data-action="mode-senate">Senate</button>
          <button class="election-btn" data-action="mode-house">House</button>
          <button class="election-btn" data-action="toggle-government-panel">Government</button>
          <button class="election-btn" data-action="map-states">States</button>
          <button class="election-btn" data-action="map-counties">Counties</button>
          <button class="election-btn primary" data-action="toggle-parties">Show / hide parties</button>
        </div>
      </section>

      <section class="candidate-strip" id="candidate-strip"></section>

      <section class="party-drawer" id="party-drawer">
        <div class="drawer-head">
          <div>
            <span class="election-kicker">Parties and blocs</span>
            <h3>Candidates and coalition setup</h3>
          </div>
          <div class="drawer-actions">
            <button class="election-btn" data-action="toggle-bloc-mode">Bloc calls on</button>
            <button class="election-btn" data-action="import-parliament">Import from Parliament</button>
            <button class="election-btn primary" data-action="add-party">Add party</button>
          </div>
        </div>
        <div class="bloc-builder">
          <input id="new-bloc-name" type="text" placeholder="New bloc / coalition name" />
          <input id="new-bloc-short" type="text" maxlength="3" placeholder="Code" aria-label="Three-letter bloc code" />
          <select id="new-bloc-mode" aria-label="Bloc type" title="Electoral blocs pool votes; coalition blocs only combine seats after elections">
            <option value="coalition">Coalition only</option>
            <option value="electoral">Electoral bloc</option>
          </select>
          <input id="new-bloc-color" type="color" value="#7c3aed" aria-label="Bloc color" />
          <button class="election-btn small" data-action="create-bloc">Make bloc</button>
          <span class="bloc-builder-status" id="bloc-builder-status"></span>
        </div>
        <div class="bloc-list" id="bloc-list"></div>
        <div class="party-editor-list" id="party-editor-list"></div>
      </section>

      <section class="count-line-card">
        <div class="count-line-head">
          <span>Electoral count</span>
          <div class="count-line-head-actions">
            <div class="chamber-view-toggle" aria-label="Count-line grouping">
              <button data-action="set-chamber-view" data-chamber-view="bloc" type="button">Bloc</button>
              <button data-action="set-chamber-view" data-chamber-view="party" type="button">Party</button>
            </div>
            <strong id="count-line-title">270 to win</strong>
          </div>
        </div>
        <div class="count-line" id="count-line"></div>
        <div class="count-legend" id="count-line-legend"></div>
      </section>

      <section class="chamber-card" id="chamber-card"></section>

      <section class="government-card" id="government-card"></section>

      <section class="simple-controls">
        <button class="simulate-btn" data-action="play-count">Simulate</button>
        <button class="duration-btn" data-action="set-duration" data-duration="120">2 minutes</button>
        <button class="duration-btn" data-action="set-duration" data-duration="300">5 minutes</button>
        <button class="duration-btn" data-action="set-duration" data-duration="600">10 minutes</button>
        <button class="duration-btn ghost" data-action="reset-count">Reset</button>
        <span class="simulation-status" id="simulation-status">0% called</span>
      </section>

      <section class="map-layout">
        <div class="real-map-card">
          <div class="map-header">
            <div>
              <span class="election-kicker" id="map-mode-label">States</span>
              <h3 id="map-title">United States</h3>
            </div>
            <div class="map-head-actions">
              <div class="chamber-view-toggle map-view-toggle" aria-label="Map grouping">
                <button data-action="set-map-view" data-map-view="bloc" type="button">Bloc</button>
                <button data-action="set-map-view" data-map-view="party" type="button">Party</button>
              </div>
              <button class="election-btn small map-reset-edits" data-action="reset-mode-edits" type="button" disabled>Reset edits</button>
              <button class="election-btn small" data-action="back-states">Back to states</button>
            </div>
          </div>
          <div class="election-map-stage" id="election-map-stage">
            <svg class="real-us-map" id="real-us-map" role="img" aria-label="US election map" tabindex="0" preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision"></svg>
            <div class="map-zoom-controls" aria-label="Map zoom controls">
              <button type="button" data-action="map-zoom-in" aria-label="Zoom in" title="Zoom in">+</button>
              <output id="map-zoom-level" aria-live="polite">100%</output>
              <button type="button" data-action="map-zoom-out" aria-label="Zoom out" title="Zoom out">&#8722;</button>
              <button type="button" data-action="map-zoom-reset" aria-label="Reset map view" title="Reset map view">&#8634;</button>
            </div>
            <div class="small-state-inset" id="small-state-inset" aria-label="Small-state map shortcuts" hidden></div>
          </div>
        </div>
        <aside class="race-sidebar">
          <section class="race-card" id="selected-race-card"></section>
          <section class="race-card" id="battle-card"></section>
        </aside>
      </section>

    `;
    const anchor = document.getElementById('analysis-wrap') || document.querySelector('.view-toggle-wrap') || document.body.lastElementChild;
    anchor.insertAdjacentElement('afterend', wrap);
    bindEvents(wrap);
    ensureTooltip();
    installMapNavigation();
  }

  function rangeControl(field, label, min, max, step) {
    return `
      <label class="simple-range">
        <span><b>${escapeHtml(label)}</b><output data-output="${field}"></output></span>
        <input type="range" min="${min}" max="${max}" step="${step}" data-setting="${field}" />
      </label>
    `;
  }

  function renderAll() {
    buildShell();
    clearQueuedMapRender();
    clearQueuedGovernmentRender();
    const result = calculateElection();
    renderCandidates(result);
    renderCountLine(result);
    renderChamberGraph(result);
    renderGovernmentAssembly(result);
    renderControls();
    renderMap(result);
    renderSidebar(result);
    renderPartyDrawer();
    bootLeaderImages();
    electionViewRendered = true;
    scheduleElectionCacheWarmup();
  }

  function renderCandidates(result) {
    const strip = document.getElementById('candidate-strip');
    if (!strip) return;
    const rows = candidateDisplayRows(result);
    const leaderId = rows[0]?.displayId;
    const modeChanged = lastCandidateRenderMode !== result.mode;
    if (modeChanged) winnerAnimationEpoch += 1;
    const existingCards = [...strip.querySelectorAll('[data-candidate-card]')];
    const existingById = new Map(existingCards.map(card => [card.dataset.candidateCard, card]));
    const currentOrder = existingCards.map(card => card.dataset.candidateCard);
    const nextOrder = rows.map(row => row.displayId);
    const orderChanged = !sameOrder(currentOrder, nextOrder);
    const canReuse = !modeChanged
      && existingCards.length === rows.length
      && rows.every(row => existingById.has(row.displayId));
    const oldRects = captureCandidateRects(strip);
    lastCandidateRenderMode = result.mode;
    if (canReuse) {
      refreshCandidateCards(result, rows);
      if (orderChanged) {
        rows.forEach(row => strip.appendChild(existingById.get(row.displayId)));
        animateCandidateReorder(strip, oldRects);
      }
      return;
    }
    strip.innerHTML = rows.map(row => candidateCardMarkup(row, leaderId, result)).join('');
    rememberCandidateMedia(strip, rows);
    animateCandidateReorder(strip, oldRects);
  }

  function rememberCandidateMedia(strip, rows) {
    const cards = new Map(
      [...strip.querySelectorAll('[data-candidate-card]')].map(card => [card.dataset.candidateCard, card])
    );
    rows.forEach(row => {
      const card = cards.get(row.displayId);
      const photo = card?.querySelector('.candidate-photo');
      const partnerRow = card?.querySelector('.candidate-partner-row');
      if (photo) candidatePhotoSources.set(photo, row.party.image || '');
      if (partnerRow) candidatePartnerKeys.set(partnerRow, candidatePartnerKey(row.partners));
    });
  }

  function sameOrder(a = [], b = []) {
    return a.length === b.length && a.every((value, index) => value === b[index]);
  }

  function candidatePartnerKey(partners = []) {
    return partners.slice(0, 5).map(row => {
      const image = row.party.image || '';
      return `${row.party.id}:${image.length}:${image.slice(-80)}`;
    }).join('|');
  }

  function candidateCardMarkup(row, leaderId, result) {
    const party = row.party;
    const assignedBloc = party.bloc ? findBloc(party.bloc) : null;
    const cardBlocName = row.blocName || assignedBloc?.name || '';
    const imageStyle = party.image ? `style="background-image:url('${escapeAttr(party.image)}')"` : '';
    const won = candidateHasWon(row, leaderId, result?.majority);
    const animateWinnerBadge = won && claimWinnerBadgeAnimation(row);
    const cardColor = row.type === 'bloc'
      ? (row.color || party.color)
      : (assignedBloc?.color || party.color);
    return `
      <article class="candidate-card ${won ? 'winner' : ''}" data-candidate-card="${escapeAttr(row.displayId)}" style="--party:${escapeAttr(party.color)};--bloc:${escapeAttr(row.color || assignedBloc?.color || party.color)};--card:${escapeAttr(cardColor)}">
        <div class="candidate-photo-stack">
          <div class="candidate-photo ${party.image ? 'has-image' : ''}" ${imageStyle}><span>${escapeHtml(initials(party.candidate || party.party))}</span></div>
          ${candidatePartnerPhotos(row.partners)}
        </div>
        <div class="candidate-info">
          <div class="candidate-tags">
            <span class="candidate-short">${escapeHtml(party.short)}</span>
            ${cardBlocName ? `<span class="candidate-bloc-tag">${escapeHtml(cardBlocName)}</span>` : ''}
          </div>
          <div class="candidate-name-line">
            <strong>${escapeHtml(party.candidate || 'Unnamed candidate')}</strong>
            ${won ? winnerCheckMarkup(cardColor, animateWinnerBadge) : ''}
          </div>
          <em>${escapeHtml(party.party)}</em>
        </div>
        <div class="candidate-score">
          <strong data-candidate-ev>${row.ev}${row.vpTieBreak ? '+VP' : ''}</strong>
          <span data-score-label>${escapeHtml(result?.unitLabel || 'points')}</span>
        </div>
        <div class="candidate-meta">
          ${row.type === 'bloc'
            ? `<span class="candidate-vote-total">${escapeHtml(row.blocName)} vote ${pct(row.popularPct)}</span>`
            : `<label class="candidate-vote-input" title="${party.ballotAccess === 'states' ? 'Share within selected states' : 'Nationwide vote share'}"><span>${party.ballotAccess === 'states' ? 'Area vote' : 'Vote'}</span><input type="number" min="0" max="100" step="0.1" value="${Number(party.base).toFixed(1)}" data-vote-share="${escapeAttr(party.id)}" /><span>%</span></label>`}
          <span data-candidate-votes>${compactVotes(row.popularVotes)}</span>
        </div>
      </article>
    `;
  }

  function candidatePartnerPhotos(partners = []) {
    if (!partners.length) return '';
    return `<div class="candidate-partner-row">
      ${partners.slice(0, 5).map(row => partyPortrait(row.party, 'candidate-partner-photo')).join('')}
    </div>`;
  }

  function candidateDisplayRows(result) {
    const byId = new Map((result.parties || []).map(row => [row.party.id, row]));
    const configuredPct = new Map(voteTargets().rows.map(row => [row.party.id, row.pct]));
    const partyOrder = new Map(app.parties.map((party, index) => [party.id, index]));
    const countStarted = app.settings.reporting > 0;
    const used = new Set();
    const rows = [];
    coalitionGroups()
      .filter(group => group.parties.length > 1 && (group.mode === 'electoral' || result.mode !== 'president'))
      .forEach(group => {
      const members = group.parties.map(party => byId.get(party.id) || zeroPartyRow(party));
      const visualMembers = [...members].sort((a, b) => blocVisualMemberSort(a, b, configuredPct, partyOrder, countStarted));
      members.forEach(row => used.add(row.party.id));
      const lead = visualMembers[0];
      rows.push({
        ...lead,
        type:'bloc',
        displayId:`bloc:${group.name}`,
        blocName:group.name,
        blocShort:group.short,
        blocMode:group.mode,
        color:group.color || blocColor(group.name, lead.party.color),
        members:visualMembers,
        partners:visualMembers.slice(1),
        ev:members.reduce((sum, row) => sum + row.ev, 0),
        states:members.reduce((sum, row) => sum + row.states, 0),
        popularPct:members.reduce((sum, row) => sum + (countStarted ? row.popularPct : configuredPct.get(row.party.id) || 0), 0),
        popularVotes:countStarted ? members.reduce((sum, row) => sum + row.popularVotes, 0) : 0,
        vpTieBreak:members.some(row => row.vpTieBreak),
      });
    });
    app.parties.forEach(party => {
      if (used.has(party.id)) return;
      const row = byId.get(party.id) || zeroPartyRow(party);
      rows.push({
        ...row,
        popularPct:countStarted ? row.popularPct : configuredPct.get(party.id) || 0,
        popularVotes:countStarted ? row.popularVotes : 0,
        type:'party',
        displayId:`party:${party.id}`,
        members:[row],
        partners:[],
        color:party.color,
      });
    });
    return rows.sort((a, b) => countStarted
      ? b.ev - a.ev || candidateConfiguredOrder(a, partyOrder) - candidateConfiguredOrder(b, partyOrder)
      : candidateConfiguredOrder(a, partyOrder) - candidateConfiguredOrder(b, partyOrder));
  }

  function blocVisualMemberSort(a, b, configuredPct, partyOrder, countStarted = false) {
    const aPct = configuredPct.get(a.party.id) ?? (Number(a.party.base) || 0);
    const bPct = configuredPct.get(b.party.id) ?? (Number(b.party.base) || 0);
    if (countStarted) {
      return (Number(b.ev) || 0) - (Number(a.ev) || 0)
        || (Number(b.popularVotes) || 0) - (Number(a.popularVotes) || 0)
        || bPct - aPct
        || (partyOrder.get(a.party.id) || 0) - (partyOrder.get(b.party.id) || 0);
    }
    return bPct - aPct || (partyOrder.get(a.party.id) || 0) - (partyOrder.get(b.party.id) || 0);
  }

  function candidateConfiguredOrder(row, partyOrder) {
    const members = row.members?.length ? row.members : [row];
    return Math.min(...members.map(member => partyOrder.get(member.party.id) ?? app.parties.length));
  }

  function zeroPartyRow(party) {
    return { party, ev:0, states:0, popularPct:0, popularVotes:0, popularWeight:0 };
  }

  function candidateHasWon(row, leaderId, majority = 270) {
    return (row?.ev >= majority || row?.vpTieBreak) && row?.displayId === leaderId;
  }

  function claimWinnerBadgeAnimation(row) {
    const key = `${winnerAnimationEpoch}:${row?.displayId || row?.party?.id || ''}`;
    if (animatedWinnerBadges.has(key)) return false;
    animatedWinnerBadges.add(key);
    return true;
  }

  function winnerCheckMarkup(color, animate = true) {
    return `
      <span class="winner-check ${animate ? '' : 'no-animate'}" style="--party:${escapeAttr(color)}" title="Projected winner" aria-label="Projected winner">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path class="winner-check-mark" d="M7.2 12.4l3.1 3.1 6.6-7.1"></path>
        </svg>
      </span>
    `;
  }

  function setStyleVarIfChanged(node, name, value) {
    const next = String(value || '');
    if (node?.style?.getPropertyValue(name) !== next) node.style.setProperty(name, next);
  }

  function setTextIfChanged(node, value) {
    const next = String(value ?? '');
    if (node && node.textContent !== next) node.textContent = next;
  }

  function setClassIfChanged(node, className, enabled) {
    const next = !!enabled;
    if (node && node.classList.contains(className) !== next) node.classList.toggle(className, next);
  }

  function captureCandidateRects(strip) {
    const rects = new Map();
    strip.querySelectorAll?.('[data-candidate-card]').forEach(card => {
      if (typeof card.getBoundingClientRect !== 'function') return;
      rects.set(card.dataset.candidateCard, card.getBoundingClientRect());
    });
    return rects;
  }

  function animateCandidateReorder(strip, oldRects) {
    if (!oldRects?.size) return;
    strip.querySelectorAll?.('[data-candidate-card]').forEach(card => {
      const oldRect = oldRects.get(card.dataset.candidateCard);
      if (!oldRect || typeof card.getBoundingClientRect !== 'function') return;
      const nextRect = card.getBoundingClientRect();
      const dx = oldRect.left - nextRect.left;
      const dy = oldRect.top - nextRect.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      if (typeof card.animate === 'function') {
        card.animate(
          [{ transform:`translate(${dx}px, ${dy}px)` }, { transform:'translate(0, 0)' }],
          { duration:340, easing:'cubic-bezier(.2,.82,.2,1)' }
        );
      }
    });
  }

  function stablePartyRows(result, includeZero = false) {
    const byId = new Map((result.parties || []).map(row => [row.party.id, row]));
    return app.parties.map(party => {
      const row = byId.get(party.id);
      return row || { party, ev:0, states:0, popularPct:0, popularVotes:0, popularWeight:0 };
    }).filter(row => includeZero || row.ev > 0 || row.popularPct > 0);
  }

  function displayRowShort(row) {
    return row.type === 'bloc'
      ? (row.blocShort || findBloc(row.blocName)?.short || shortCode(row.blocName))
      : row.party.short;
  }

  function displayRowName(row) {
    return row.type === 'bloc' ? row.blocName : row.party.party;
  }

  function displayRowColor(row) {
    return row.type === 'bloc' ? (row.color || blocColor(row.blocName, row.party.color)) : row.party.color;
  }

  function renderCountLine(result) {
    const line = document.getElementById('count-line');
    const legend = document.getElementById('count-line-legend');
    const title = document.getElementById('count-line-title');
    const label = document.querySelector('.count-line-head span');
    if (!line) return;
    const totalUnits = result.totalUnits || 538;
    const majority = result.majority || 270;
    const unitLabel = result.unitLabel || 'points';
    const view = app.settings.chamberView === 'party' ? 'party' : 'bloc';
    const rows = chamberDisplayRows(result, view).filter(row => row.ev > 0);
    const leader = [...rows].sort((a, b) => b.ev - a.ev || a.chamberAlignment - b.chamberAlignment)[0];
    const calledEv = rows.reduce((sum, row) => sum + row.ev, 0);
    const vpRow = result.vpTieBreakParty
      ? rows.find(row => (row.members || [row]).some(member => member.party?.id === result.vpTieBreakParty.id))
      : null;
    line.closest('.count-line-card')?.style.setProperty('--majority-color', leader?.ev >= majority ? displayRowColor(leader) : '#fbbf24');
    if (label) label.textContent = result.mapLabel || 'Electoral count';
    if (title) title.textContent = result.vpTieBreakParty
      ? `${vpRow ? displayRowShort(vpRow) : result.vpTieBreakParty.short} controls Senate via VP`
      : leader?.ev >= majority
      ? `${displayRowShort(leader)} crosses ${majority}`
      : `${calledEv}/${totalUnits} called · ${Math.max(0, majority - (leader?.ev || 0))} ${unitLabel} to ${majority}`;
    const uncalledEv = Math.max(0, totalUnits - calledEv);
    line.innerHTML = `
      <div class="count-majority-marker" style="left:${(majority / totalUnits * 100).toFixed(3)}%"><span>${majority}</span></div>
      ${rows.map(row => `
        <span class="count-segment ${row.ev >= Math.max(6, totalUnits * 0.035) ? 'labeled' : ''}" data-label="${escapeAttr(displayRowShort(row))}" style="--party:${escapeAttr(displayRowColor(row))};width:${(row.ev / totalUnits * 100).toFixed(3)}%" title="${escapeAttr(displayRowName(row))} ${row.ev}"></span>
      `).join('')}
      <span class="count-segment uncalled ${uncalledEv >= Math.max(6, totalUnits * 0.035) ? 'labeled' : ''}" data-label="UNC" style="width:${(uncalledEv / totalUnits * 100).toFixed(3)}%" title="Uncalled ${uncalledEv}"></span>
    `;
    if (legend) {
      legend.innerHTML = `
        ${rows.map(row => `
          <span class="count-legend-item">
            <i style="background:${escapeAttr(displayRowColor(row))}"></i>
            <b>${escapeHtml(displayRowShort(row))}</b>
            <em>${row.ev}</em>
          </span>
        `).join('')}
        ${uncalledEv > 0 ? `
          <span class="count-legend-item muted">
            <i></i>
            <b>UNC</b>
            <em>${uncalledEv}</em>
          </span>
        ` : ''}
      `;
    }
  }

  function renderChamberGraph(result) {
    const card = document.getElementById('chamber-card');
    if (!card) return;
    if (!['house', 'senate'].includes(result.mode)) {
      card.hidden = true;
      card.innerHTML = '';
      return;
    }
    card.hidden = false;
    const chamberView = app.settings.chamberView === 'party' ? 'party' : 'bloc';
    const displayRows = chamberDisplayRows(result, chamberView).filter(row => row.ev > 0);
    const calledSeats = displayRows.reduce((sum, row) => sum + row.ev, 0);
    const majorityRows = chamberDisplayRows(result, 'bloc').filter(row => row.ev > 0);
    const majorityEntity = chamberMajorityEntity(majorityRows, result.majority);
    card.classList.toggle('has-majority-party', !!majorityEntity);
    card.style.setProperty('--majority-color', majorityEntity?.color || '#fbbf24');
    const dotCount = result.totalUnits;
    const seatRows = displayRows.map(row => ({
      units: row.ev,
      color: row.color || row.party.color,
      label: row.type === 'bloc' ? row.blocName : row.party.short,
      title: `${row.type === 'bloc' ? row.blocName : row.party.party} ${row.ev}`,
      uncalled: false,
    }));
    const uncalledUnits = Math.max(0, result.totalUnits - calledSeats);
    if (uncalledUnits) {
      seatRows.push({
        units: uncalledUnits,
        color: '#64748b',
        label: 'UNC',
        title: `Uncalled ${uncalledUnits}`,
        uncalled: true,
      });
    }
    const seatCounts = chamberDotCounts(seatRows.map(row => row.units), result.totalUnits, dotCount);
    const seats = [];
    seatRows.forEach((row, rowIndex) => {
      for (let i = 0; i < (seatCounts[rowIndex] || 0); i += 1) seats.push(row);
    });
    while (seats.length < dotCount) seats.push({ color:'#64748b', label:'UNC', title:'Uncalled', uncalled:true });
    const positions = chamberSeatPositions(dotCount);
    const senateMode = result.totalUnits <= 120;
    const seatSize = senateMode ? '9px' : 'clamp(3.8px, 0.48vw, 5.5px)';
    card.innerHTML = `
      <div class="chamber-head">
        <div>
          <span class="election-kicker">${result.mode === 'senate' ? 'Senate chamber' : 'House chamber'}</span>
          <h3>${calledSeats}/${result.totalUnits} ${escapeHtml(result.unitLabel || 'seats')} called</h3>
        </div>
        <div class="chamber-head-actions">
          <div class="chamber-view-toggle" aria-label="Chamber grouping">
            <button class="${chamberView === 'bloc' ? 'active' : ''}" data-action="set-chamber-view" data-chamber-view="bloc" type="button">Bloc</button>
            <button class="${chamberView === 'party' ? 'active' : ''}" data-action="set-chamber-view" data-chamber-view="party" type="button">Party</button>
          </div>
          <strong>${result.majority} majority</strong>
        </div>
      </div>
      <div class="chamber-hemicycle ${senateMode ? 'senate' : 'house'}" style="--seat-size:${seatSize}">
        <span class="chamber-majority-line"><b>${result.majority}</b></span>
        <div class="chamber-floor"><span>Majority</span><b>${result.majority}</b></div>
        ${positions.map((pos, index) => {
          const seat = seats[index] || { color:'#64748b', label:'UNC', title:'Uncalled', uncalled:true };
          return `<span class="chamber-seat ${seat.uncalled ? 'uncalled' : ''}" style="--x:${pos.x.toFixed(2)}%;--y:${pos.y.toFixed(2)}%;--party:${escapeAttr(seat.color)}" title="${escapeAttr(seat.title)}"></span>`;
        }).join('')}
      </div>
      <div class="chamber-legend">
        ${displayRows.slice(0, 8).map(row => `
          <span><i style="background:${escapeAttr(row.color || row.party.color)}"></i><b>${escapeHtml(displayRowShort(row))}</b><em>${row.ev}</em></span>
        `).join('')}
        ${calledSeats < result.totalUnits ? `<span class="muted"><i></i><b>UNC</b><em>${result.totalUnits - calledSeats}</em></span>` : ''}
      </div>
    `;
  }

  function renderGovernmentAssembly(result, options = {}) {
    const card = document.getElementById('government-card');
    if (!card) return;
    const locked = app.settings.reporting < 100;
    card.hidden = !app.government.open;
    card.className = `government-card ${locked ? 'locked' : ''}`;
    if (!app.government.open) {
      card.innerHTML = '';
      card.style.removeProperty('--government-accent');
      pendingGovernmentAnimation = null;
      stableMarkup.delete(card);
      return;
    }
    if (locked) {
      setStableMarkup(card, `
        <div class="government-head">
          <div>
            <span class="election-kicker">Post-count mode locked</span>
            <h3>${escapeHtml(app.government.name || 'Assemble the Administration')}</h3>
            <p>Locked until all races finish counting · ${Math.round(app.settings.reporting)}% called</p>
          </div>
          <div class="government-actions">
            <button class="election-btn small" data-action="close-government-panel">Hide</button>
            <button class="election-btn small" data-action="clear-government" disabled>Clear</button>
          </div>
        </div>
      `);
      card.style.removeProperty('--government-accent');
      pendingGovernmentAnimation = null;
      return;
    }
    const reusableSnapshot = options.reuseElectionSnapshot ? governmentElectionSnapshot : null;
    const assembly = calculateGovernmentAssembly(result, reusableSnapshot);
    governmentElectionSnapshot = {
      president:assembly.president,
      house:assembly.house,
      senate:assembly.senate,
    };
    const formation = governmentFormationState(assembly);
    const celebrateFormation = governmentFormationShouldAnimate(formation);
    const interaction = pendingGovernmentAnimation;
    const statusText = locked
      ? `Locked until all races finish counting · ${Math.round(app.settings.reporting)}% called`
      : 'Unlocked · final-count governing phase';
    const cabinetSeats = chamberRoleTotals(assembly.seatRows, 'cabinet');
    const governingSeats = chamberRoleTotals(assembly.seatRows, 'governing');
    const requiredVotes = assembly.votes.filter(vote => assembly.agenda.chambers.includes(vote.chamber));
    const agendaPassed = governmentVotePassed(requiredVotes);
    card.style.setProperty('--government-accent', formation.accent);
    card.className = `government-card ${formation.formed ? 'formed' : 'building'} ${celebrateFormation ? 'formation-celebration' : ''} ${interaction?.type === 'panel' ? 'panel-opening' : ''}`;
    setStableMarkup(card, `
      <div class="government-head">
        <div>
          <span class="election-kicker">${locked ? 'Post-count mode locked' : 'Government assembly'}</span>
          <h3>${escapeHtml(app.government.name || 'Assemble the Administration')}</h3>
          <p>${escapeHtml(statusText)}</p>
        </div>
        <div class="government-actions">
          <button class="election-btn small" data-action="close-government-panel">Hide</button>
          <button class="election-btn small" data-action="clear-government" ${locked ? 'disabled' : ''}>Clear</button>
        </div>
      </div>
      ${governmentFormationMarkup(formation, celebrateFormation)}
      <div class="government-track">
        ${governmentDecisionCard('President', assembly.presidentDecision, locked, 'president', interaction)}
        ${governmentDecisionCard('Vice President', assembly.viceDecision, locked, 'vice', interaction)}
        <div class="government-decision-card governing-math ${interaction?.type === 'role' ? 'is-updating' : ''}">
          <span class="government-mini-label">Governing math</span>
          <strong>${governingSeats.house}/${HOUSE_SEATS} House · ${governingSeats.senate}/${SENATE_SEATS} Senate</strong>
          <em>Cabinet ${cabinetSeats.house} House seats and ${cabinetSeats.senate} senators. External support counts for votes, not cabinet control.</em>
          <div class="government-progress">
            <i style="width:${(governingSeats.house / HOUSE_SEATS * 100).toFixed(2)}%;background:#38bdf8"></i>
            <i style="width:${(governingSeats.senate / SENATE_SEATS * 100).toFixed(2)}%;background:#fbbf24"></i>
          </div>
        </div>
      </div>
      ${assembly.presidentDecision.type === 'contingent' ? contingentStateDelegationMarkup(assembly.presidentDecision) : ''}
      <div class="government-builder">
        <div class="government-section-head">
          <div>
            <span class="election-kicker">Administration builder</span>
            <h4>Assign parties to cabinet, support, abstain, or opposition</h4>
          </div>
          <input class="government-name-input" data-government-name value="${escapeAttr(app.government.name)}" placeholder="Government name" ${locked ? 'disabled' : ''} />
        </div>
        <div class="government-party-grid">
          ${governmentBuilderRows(assembly.seatRows).map(row => governmentPartyRow(row, locked, interaction)).join('')}
        </div>
      </div>
      <div class="government-votes ${interaction?.type === 'vote' ? (agendaPassed ? 'vote-passed' : 'vote-failed') : ''}">
        <div class="government-section-head">
          <div>
            <span class="election-kicker">Agenda votes</span>
            <h4>${escapeHtml(assembly.agenda.label)} · ${agendaPassed ? 'passes' : 'fails'}</h4>
          </div>
          <button class="election-btn small primary" data-action="hold-gov-vote" ${locked ? 'disabled' : ''}>Hold vote</button>
        </div>
        <div class="agenda-tabs">
          ${GOVERNMENT_AGENDA.map(item => `
            <button class="${item.key === assembly.agenda.key ? 'active' : ''} ${interaction?.type === 'agenda' && interaction.key === item.key ? 'is-changing' : ''}" data-action="set-gov-agenda" data-agenda="${escapeAttr(item.key)}" ${locked ? 'disabled' : ''}>${escapeHtml(item.label)}</button>
          `).join('')}
        </div>
        <p class="government-agenda-desc">${escapeHtml(assembly.agenda.desc)}</p>
        <div class="government-vote-grid">
          ${assembly.votes.map(vote => governmentVoteCard(vote, assembly.agenda, interaction?.type === 'vote')).join('')}
        </div>
        ${governmentHistoryMarkup(interaction)}
      </div>
    `);
    pendingGovernmentAnimation = null;
  }

  function governmentDecisionCard(title, decision, locked, office, interaction = null) {
    const party = decision.party;
    const partyColor = partyCoalitionColor(party);
    const pctValue = decision.target ? clamp((decision.votes || 0) / decision.target * 100, 0, 100, 0) : 0;
    const action = office === 'vice' ? 'set-gov-vice' : 'set-gov-president';
    const field = office === 'vice' ? 'vicePresidentId' : 'presidentId';
    const changing = interaction?.type === 'office' && interaction.field === field;
    return `
      <div class="government-decision-card ${locked ? 'muted' : ''} ${changing ? 'office-changing' : ''}" style="--party:${escapeAttr(partyColor)}">
        <span class="government-mini-label">${escapeHtml(title)} · ${escapeHtml(decision.label)}</span>
        <div class="government-decision-main">
          ${partyPortrait(party, 'government-winner-photo')}
          <div>
            <strong>${escapeHtml(party?.candidate || party?.party || 'No party')}</strong>
            <em>${escapeHtml(decision.status || '')}</em>
          </div>
        </div>
        <div class="government-progress"><i style="width:${pctValue.toFixed(2)}%;background:${escapeAttr(partyColor)}"></i></div>
        <div class="government-choice-row">
          ${(decision.finalists || []).map(candidate => `
            <button class="${party?.id === candidate.id ? 'active' : ''} ${changing && interaction.key === candidate.id ? 'is-changing' : ''}" style="--choice-color:${escapeAttr(partyCoalitionColor(candidate))}" data-action="${action}" data-party="${escapeAttr(candidate.id)}" ${locked ? 'disabled' : ''}>
              <i style="background:${escapeAttr(partyCoalitionColor(candidate))}"></i>
              <span>${escapeHtml(candidate.short)}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function contingentStateDelegationMarkup(decision) {
    const rows = (decision.rows || []).slice(0, 3);
    const stateVotes = decision.stateVotes || [];
    const manualMode = app.government.delegationMode === 'manual';
    const requestedState = app.government.selectedDelegationState;
    const selectedRow = stateVotes.find(row => row.state.abbr === requestedState)
      || stateVotes.find(row => row.state.abbr === app.selectedState)
      || stateVotes[0];
    const assignmentCount = manualMode ? stateVotes.filter(row => row.manualOverride && !row.deadlocked).length : 0;
    const unassignedCount = manualMode ? (decision.unassigned || 0) : 0;
    const manualSummary = [
      unassignedCount ? `${unassignedCount} await assignment` : '',
      decision.deadlocked ? `${decision.deadlocked} deadlocked` : '',
    ].filter(Boolean).join(' · ');
    const summary = manualMode
      ? manualSummary ? `${manualSummary}.` : 'Every delegation currently casts a vote.'
      : decision.deadlocked
        ? `${decision.deadlocked} delegations are divided or unavailable.`
        : 'Every delegation currently casts a vote.';
    const manualStatus = [
      `${assignmentCount} assigned`,
      `${unassignedCount} open`,
      decision.deadlocked ? `${decision.deadlocked} deadlocked` : '',
    ].filter(Boolean).join(' · ');
    return `
      <div class="contingent-panel">
        <div class="contingent-summary">
          <span class="election-kicker">House state delegations</span>
          <h4>One vote per state · 26 needed</h4>
          <p>${summary}</p>
          <div class="delegation-mode-control" aria-label="State delegation voting mode">
            <button class="${manualMode ? '' : 'active'}" data-action="set-delegation-mode" data-delegation-mode="auto" type="button">Automatic</button>
            <button class="${manualMode ? 'active' : ''}" data-action="set-delegation-mode" data-delegation-mode="manual" type="button">Manual</button>
          </div>
          <em class="delegation-mode-status">${manualMode ? manualStatus : 'Ideology-based projection'}</em>
        </div>
        <div class="contingent-scoreboard">
          ${rows.map(row => `
            <span style="--party:${escapeAttr(partyCoalitionColor(row.party))}"><b>${escapeHtml(row.party.short)}</b><em>${row.votes}</em></span>
          `).join('')}
        </div>
        <div class="delegation-workbench">
          <div class="state-delegation-strip">
            ${stateVotes.map(row => stateDelegationTile(row, selectedRow, manualMode)).join('')}
          </div>
          ${selectedRow ? delegationAssignmentMarkup(selectedRow, decision.finalists || [], manualMode) : ''}
        </div>
      </div>
    `;
  }

  function stateDelegationTile(row, selectedRow, manualMode) {
    const controller = row.controller;
    const controlLeader = row.controlLeader;
    const controlColor = partyCoalitionColor(controller || controlLeader);
    const controlCode = controller?.short || (row.controlRanked?.length ? 'SPL' : 'UNC');
    const voteColor = partyCoalitionColor(row.party);
    const classes = [
      row.deadlocked ? 'deadlocked' : '',
      row.unassigned ? 'unassigned' : '',
      row.manualOverride ? 'overridden' : '',
      selectedRow?.state.abbr === row.state.abbr ? 'selected' : '',
      pendingGovernmentAnimation?.key === row.state.abbr && /^delegation-/.test(pendingGovernmentAnimation.type || '') ? 'changing' : '',
    ].filter(Boolean).join(' ');
    return `
      <button class="${classes}" style="--party:${escapeAttr(voteColor)};--control:${escapeAttr(controlColor)}" data-action="select-delegation-state" data-state="${escapeAttr(row.state.abbr)}" type="button" title="${escapeAttr(contingentDelegationTitle(row))}" aria-label="${escapeAttr(row.state.name)} delegation">
        <b>${escapeHtml(row.state.abbr)}</b>
        <small><i></i>${escapeHtml(controlCode)}</small>
        ${manualMode && row.manualOverride ? '<span>SET</span>' : (row.unassigned ? '<span>OPEN</span>' : '')}
      </button>
    `;
  }

  function delegationAssignmentMarkup(row, finalists, manualMode) {
    const actualTally = (row.controlRanked || [])
      .map(item => `<span style="--control:${escapeAttr(partyCoalitionColor(item.party))}"><i></i><b>${escapeHtml(item.party.short)}</b><em>${item.seats}</em></span>`)
      .join('');
    const controlLabel = row.controller
      ? `${row.controller.short} controls ${row.controllerSeats}/${row.delegationSize}`
      : `Split delegation · ${row.needed} needed`;
    const savedChoice = manualMode ? String(app.government.delegationVotes?.[row.state.abbr] || '') : '';
    const storedChoice = savedChoice === 'deadlock' || finalists.some(party => party.id === savedChoice) ? savedChoice : 'default';
    const defaultLabel = manualMode ? (row.requiresAssignment ? 'Unassigned' : 'House result') : 'Automatic';
    const voteLabel = row.unassigned
      ? 'Awaiting assignment'
      : row.deadlocked
        ? 'No state vote · deadlocked'
        : `${row.party?.short || 'None'} receives the state vote`;
    return `
      <div class="delegation-assignment ${manualMode ? 'manual' : 'automatic'}" style="--vote:${escapeAttr(partyCoalitionColor(row.party))}">
        <div class="delegation-assignment-head">
          <div>
            <span>${escapeHtml(row.state.name)} · House control</span>
            <strong>${escapeHtml(controlLabel)}</strong>
          </div>
          <em>${escapeHtml(voteLabel)}</em>
        </div>
        <div class="delegation-control-tally">${actualTally || '<span class="uncalled"><b>UNC</b><em>0</em></span>'}</div>
        <div class="delegation-vote-choices" aria-label="${escapeAttr(row.state.name)} contingent vote">
          <button class="${storedChoice === 'default' ? 'active' : ''}" data-action="set-delegation-vote" data-state="${escapeAttr(row.state.abbr)}" data-party="default" type="button" ${manualMode ? '' : 'disabled'}>${defaultLabel}</button>
          ${finalists.map(party => `
            <button class="${storedChoice === party.id ? 'active' : ''}" style="--choice:${escapeAttr(partyCoalitionColor(party))}" data-action="set-delegation-vote" data-state="${escapeAttr(row.state.abbr)}" data-party="${escapeAttr(party.id)}" type="button" ${manualMode ? '' : 'disabled'}>
              <i></i>${escapeHtml(party.short)}
            </button>
          `).join('')}
          <button class="deadlock-choice ${storedChoice === 'deadlock' ? 'active' : ''}" data-action="set-delegation-vote" data-state="${escapeAttr(row.state.abbr)}" data-party="deadlock" type="button" ${manualMode ? '' : 'disabled'}>Deadlock</button>
        </div>
      </div>
    `;
  }

  function contingentDelegationTitle(row) {
    const controlTally = (row.controlRanked || [])
      .filter(item => item.seats > 0)
      .map(item => `${item.party.short} ${item.seats}`)
      .join(' / ');
    const control = row.controller
      ? `${row.controller.short} controls ${row.controllerSeats}/${row.delegationSize}`
      : `split House control${controlTally ? ` (${controlTally}; ${row.needed} needed)` : ''}`;
    const ballot = row.unassigned ? 'awaiting manual assignment' : row.tied ? 'no contingent vote' : `${row.party.short} receives state vote`;
    const method = row.manualOverride ? 'manual' : (app.government.delegationMode === 'manual' ? 'House result' : 'automatic');
    return `${row.state.name}: ${control} · ${ballot} · ${method}`;
  }

  function chamberRoleTotals(seatRows, role) {
    const rows = role === 'governing'
      ? seatRows.filter(row => row.role === 'cabinet' || row.role === 'support')
      : seatRows.filter(row => row.role === role);
    return rows.reduce((totals, row) => {
      totals.house += row.house || 0;
      totals.senate += row.senate || 0;
      return totals;
    }, { house:0, senate:0 });
  }

  function governmentPartyRow(row, locked, interaction = null) {
    const activeRole = row.role;
    const entityId = row.entityId || row.party.id;
    const coalition = row.type === 'coalition' && row.members?.length > 1;
    const changing = interaction?.type === 'role' && interaction.key === entityId;
    const title = coalition
      ? `${row.coalitionShort} · ${row.coalitionName}`
      : `${row.party.short} · ${row.party.party}`;
    const memberCodes = coalition ? row.members.map(member => member.party.short).join(' + ') : '';
    return `
      <article class="government-party-row ${coalition ? 'coalition' : ''} ${activeRole} ${changing ? 'role-changing' : ''}" style="--party:${escapeAttr(row.color || row.party.color)}">
        <div class="government-party-portrait-stack">
          ${partyPortrait(row.party, 'government-party-photo')}
          ${coalition ? `<div class="government-party-partners">${row.members.slice(1, 4).map(member => partyPortrait(member.party, 'government-party-partner-photo')).join('')}</div>` : ''}
        </div>
        <div class="government-party-copy">
          <strong>${escapeHtml(title)}</strong>
          ${coalition ? `<span>${escapeHtml(memberCodes)}</span>` : ''}
          <em>${row.house} House · ${row.senate}${row.vp ? '+VP' : ''} Senate · ${escapeHtml(governmentRoleLabel(activeRole))}</em>
        </div>
        <div class="government-role-buttons">
          ${['cabinet','support','passive','opposition'].map(role => `
            <button class="${activeRole === role ? 'active' : ''} ${changing && interaction.role === role ? 'is-changing' : ''}" data-action="set-gov-role" data-party="${escapeAttr(row.party.id)}" data-gov-role="${role}" ${locked ? 'disabled' : ''}>${escapeHtml(governmentRoleLabel(role, true))}</button>
          `).join('')}
        </div>
      </article>
    `;
  }

  function governmentRoleLabel(role, short = false) {
    const labels = {
      cabinet: short ? 'Cab' : 'Cabinet',
      support: short ? 'Sup' : 'External support',
      passive: short ? 'Abs' : 'Abstain / present',
      opposition: short ? 'Opp' : 'Opposition',
    };
    return labels[role] || role;
  }

  function governmentVoteCard(vote, agenda, justHeld = false) {
    const required = agenda.chambers.includes(vote.chamber);
    const chamberName = vote.chamber === 'house' ? 'House' : 'Senate';
    const yesPct = vote.yes / vote.total * 100;
    const abstainPct = vote.abstain / vote.total * 100;
    const noPct = Math.max(0, 100 - yesPct - abstainPct);
    return `
      <article class="government-vote-card ${required ? (vote.passed ? 'passed' : 'failed') : 'muted'} ${justHeld && required ? 'vote-just-held' : ''}">
        <div class="government-vote-head">
          <span>${chamberName}</span>
          <strong>${required ? (vote.passed ? 'PASS' : 'FAIL') : 'Not required'}</strong>
        </div>
        <div class="government-vote-bar">
          <i class="yes" style="width:${yesPct.toFixed(2)}%"></i>
          <i class="abstain" style="width:${abstainPct.toFixed(2)}%"></i>
          <i class="no" style="width:${noPct.toFixed(2)}%"></i>
        </div>
        <div class="government-vote-meta">
          <span>Yes ${vote.yes}${vote.vpCanBreakTie ? '+VP' : ''}</span>
          <span>No ${vote.no}</span>
          <span>Abstain ${vote.abstain}</span>
          <b>${vote.threshold} needed</b>
        </div>
      </article>
    `;
  }

  function governmentHistoryMarkup(interaction = null) {
    const history = app.government.history || [];
    return `
      <div class="government-history">
        <span class="election-kicker">Vote record</span>
        ${history.length ? history.map(item => `
          <div class="${item.passed ? 'passed' : 'failed'} ${interaction?.type === 'vote' && interaction.key === item.id ? 'just-added' : ''}">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.result)}</span>
            <em>${escapeHtml(item.detail)}</em>
          </div>
        `).join('') : '<p>No votes held yet.</p>'}
      </div>
    `;
  }

  function chamberDisplayRows(result, view = 'bloc') {
    const rows = view === 'party' ? chamberPartyRows(result) : candidateDisplayRows(result);
    return rows
      .map(row => ({
        ...row,
        chamberAlignment: chamberRowAlignment(row),
      }))
      .sort((a, b) => a.chamberAlignment - b.chamberAlignment || (b.ev - a.ev) || String(a.displayId).localeCompare(String(b.displayId)));
  }

  function chamberPartyRows(result) {
    return (result.parties || []).map(row => ({
      ...row,
      type:'party',
      displayId:`party:${row.party.id}`,
      members:[row],
      partners:[],
      color:row.party.color,
    }));
  }

  function chamberMajorityEntity(displayRows, majority) {
    const threshold = Number(majority) || 0;
    if (!threshold) return null;
    const winners = displayRows.filter(row => Number(row.ev) >= threshold || row.vpTieBreak);
    if (winners.length !== 1) return null;
    const row = winners[0];
    return {
      type: row.type,
      id: row.displayId,
      color: row.type === 'bloc'
        ? (row.color || blocColor(row.blocName, row.party?.color || '#fbbf24'))
        : (row.party?.bloc ? blocColor(row.party.bloc, row.party?.color || row.color || '#fbbf24') : (row.party?.color || row.color || '#fbbf24')),
    };
  }

  function chamberRowAlignment(row) {
    const members = row.members?.length ? row.members : [row];
    const weightTotal = members.reduce((sum, member) => sum + Math.max(1, Number(member.ev) || Number(member.popularPct) || 1), 0) || 1;
    return members.reduce((sum, member) => {
      const party = member.party || row.party;
      const weight = Math.max(1, Number(member.ev) || Number(member.popularPct) || 1);
      return sum + partyAlignmentScore(party) * weight;
    }, 0) / weightTotal;
  }

  function chamberDotCounts(values, totalUnits, dotCount) {
    const safeTotal = Math.max(1, Number(totalUnits) || values.reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0));
    const exactRows = values.map((value, index) => {
      const units = Math.max(0, Number(value) || 0);
      const exact = units / safeTotal * dotCount;
      const count = Math.floor(exact);
      return { index, units, count, remainder: exact - count };
    });
    let assigned = exactRows.reduce((sum, row) => sum + row.count, 0);
    exactRows
      .filter(row => row.units > 0)
      .sort((a, b) => b.remainder - a.remainder || b.units - a.units || a.index - b.index)
      .forEach(row => {
        if (assigned < dotCount) {
          row.count += 1;
          assigned += 1;
        }
      });
    let cursor = exactRows.length - 1;
    while (assigned < dotCount && exactRows.length) {
      exactRows[Math.max(0, cursor)].count += 1;
      assigned += 1;
      cursor = cursor <= 0 ? exactRows.length - 1 : cursor - 1;
    }
    return exactRows.sort((a, b) => a.index - b.index).map(row => row.count);
  }

  function chamberSeatPositions(dotCount) {
    const rows = 5;
    const houseMode = dotCount > 300;
    const gap = houseMode ? 0.20 : 0.07;
    const angleRange = Math.PI - gap * 2;
    const radii = Array.from({ length: rows }, (_item, row) => 68 + (row / (rows - 1)) * 96);
    const totalCircumference = radii.reduce((sum, radius) => sum + Math.PI * radius, 0);
    const counts = chamberDotCounts(
      radii.map(radius => Math.PI * radius),
      totalCircumference,
      dotCount,
    );
    const positions = [];
    const width = 620;
    const height = 310;
    const centerX = width / 2;
    const centerY = 270;
    const horizontalScale = houseMode ? 1.68 : 1.36;
    const verticalScale = houseMode ? 1.12 : 1;
    radii.forEach((radius, row) => {
      const count = Math.max(1, counts[row] || 0);
      for (let index = 0; index < count; index += 1) {
        const frac = (index + 0.5) / count;
        const angle = Math.PI + gap + frac * angleRange;
        positions.push({
          frac,
          row,
          x: (centerX + radius * horizontalScale * Math.cos(angle)) / width * 100,
          y: (centerY + radius * verticalScale * Math.sin(angle)) / height * 100,
        });
      }
    });
    return positions.sort((a, b) => a.frac - b.frac || a.row - b.row).slice(0, dotCount);
  }

  function renderControls() {
    const status = document.getElementById('simulation-status');
    const voteSetup = voteSetupValidation();
    if (status) {
      status.textContent = voteSetup.valid
        ? `${Math.round(app.settings.reporting)}% called · setup ${voteSetup.total.toFixed(1)}%`
        : voteSetup.message;
      status.classList.toggle('invalid', !voteSetup.valid);
      status.title = voteSetup.valid
        ? 'Effective national total after weighting state-limited parties by covered-state turnout.'
        : `${voteSetup.message}. Adjust party vote shares or ballot access before simulating.`;
    }
    const playBtn = document.querySelector('[data-action="play-count"]');
    if (playBtn) {
      playBtn.textContent = countTimer ? 'Pause' : 'Simulate';
      playBtn.classList.toggle('active', !!countTimer);
      playBtn.disabled = !countTimer && !voteSetup.valid;
      playBtn.classList.toggle('invalid', !voteSetup.valid);
      playBtn.title = voteSetup.valid ? 'Start or pause election-night counting' : voteSetup.message;
    }
    document.querySelectorAll('[data-action="set-duration"]').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.duration) === Number(app.settings.simDuration));
    });
    document.querySelectorAll('[data-action="set-chamber-view"]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.chamberView === app.settings.chamberView);
    });
    document.querySelectorAll('[data-action="set-map-view"]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mapView === app.settings.mapView);
    });
    const resetModeEdits = document.querySelector('[data-action="reset-mode-edits"]');
    if (resetModeEdits) {
      const editCount = modeRaceEditCount();
      resetModeEdits.disabled = editCount === 0;
      resetModeEdits.textContent = editCount ? `Reset edits (${editCount})` : 'Reset edits';
      resetModeEdits.classList.toggle('has-edits', editCount > 0);
      resetModeEdits.title = editCount
        ? `Clear ${editCount} manual ${app.electionMode === 'house' ? 'House' : app.electionMode === 'senate' ? 'Senate' : 'presidential'} race ${editCount === 1 ? 'override' : 'overrides'}`
        : 'No manual race overrides in this mode';
    }
    const blocBtn = document.querySelector('[data-action="toggle-bloc-mode"]');
    if (blocBtn) {
      blocBtn.textContent = app.settings.coalitionMode ? 'Electoral bloc calls on' : 'Electoral bloc calls off';
      blocBtn.classList.toggle('active', !!app.settings.coalitionMode);
    }
    refreshBlocShareControls();
    const presidentBtn = document.querySelector('[data-action="mode-president"]');
    const senateBtn = document.querySelector('[data-action="mode-senate"]');
    const houseBtn = document.querySelector('[data-action="mode-house"]');
    const governmentBtn = document.querySelector('[data-action="toggle-government-panel"]');
    presidentBtn?.classList.toggle('active', app.electionMode === 'president');
    senateBtn?.classList.toggle('active', app.electionMode === 'senate');
    houseBtn?.classList.toggle('active', app.electionMode === 'house');
    governmentBtn?.classList.toggle('active', !!app.government.open);
    governmentBtn?.classList.toggle('locked', app.settings.reporting < 100);
    const governmentFormed = app.settings.reporting >= 100 && document.getElementById('government-card')?.classList.contains('formed');
    governmentBtn?.classList.toggle('government-formed', !!governmentFormed);
    if (governmentBtn) {
      const accent = document.getElementById('government-card')?.style.getPropertyValue('--government-accent') || '#38bdf8';
      governmentBtn.style.setProperty('--government-accent', accent);
      governmentBtn.setAttribute('aria-label', governmentFormed ? 'Government formed' : 'Government assembly');
    }
  }

  function signedSwing(value) {
    const n = Number(value) || 0;
    if (Math.abs(n) < 0.05) return 'Even';
    return n > 0 ? `Right +${n.toFixed(1)}` : `Left +${Math.abs(n).toFixed(1)}`;
  }

  function refreshMapModeControls() {
    const stateButton = document.querySelector('[data-action="map-states"]');
    const countyButton = document.querySelector('[data-action="map-counties"]');
    stateButton?.classList.toggle('active', app.electionMode === 'president' && app.mapMode === 'states');
    countyButton?.classList.toggle('active', app.electionMode === 'president' && app.mapMode === 'counties');
  }

  function renderMapSelection() {
    const svg = document.getElementById('real-us-map');
    if (!svg) return;
    svg.querySelectorAll('[data-state]').forEach(path => {
      path.classList.toggle('selected', path.dataset.state === app.selectedState);
    });
    svg.querySelectorAll('[data-county]').forEach(path => {
      path.classList.toggle('selected', String(path.dataset.county) === String(app.selectedCounty));
    });
    const selectedUnitDistrict = splitEvDistrictId(app.selectedElectoralUnit);
    svg.querySelectorAll('[data-district]').forEach(path => {
      if (app.electionMode === 'house') {
        path.classList.toggle('selected', path.dataset.district === app.selectedDistrict);
      }
      path.classList.toggle('unit-selected', app.electionMode === 'president' && path.dataset.district === selectedUnitDistrict);
    });
    document.querySelectorAll('#small-state-inset [data-state-pick]').forEach(tile => {
      const selected = tile.dataset.statePick === app.selectedState;
      tile.classList.toggle('selected', selected);
      tile.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  function renderSelectedRace() {
    renderMapSelection();
    renderSidebar(calculateElection());
  }

  function renderMap(result) {
    const svg = document.getElementById('real-us-map');
    if (!svg || !window.US_ELECTION_MAP_DATA) return;
    svg.innerHTML = '';
    resetSmallStateInset();
    const modeLabel = document.getElementById('map-mode-label');
    const title = document.getElementById('map-title');
    const back = document.querySelector('[data-action="back-states"]');
    refreshMapModeControls();

    if (app.electionMode === 'house') {
      renderHouseMap(svg, result, modeLabel, title, back);
      return;
    }
    if (app.electionMode === 'senate') {
      renderSenateMap(svg, result, modeLabel, title, back);
      renderSmallStateInset(result, 'senate');
      return;
    }

    if (app.mapMode === 'counties') {
      const state = stateByAbbr.get(app.selectedState) || stateByAbbr.get('PA');
      const stateShape = statePathByAbbr.get(state.abbr);
      const counties = countiesByState.get(state.abbr) || [];
      const underlay = createMapUnderlayLayer(svg);
      setSvgViewBox(svg, paddedBbox(stateShape?.bbox || window.US_ELECTION_MAP_DATA.viewBox, 10), `counties-${state.abbr}`);
      if (modeLabel) modeLabel.textContent = 'Counties';
      if (title) title.textContent = `${state.name} counties`;
      if (back) back.style.display = '';
      counties.forEach(county => {
        const row = countyResult(county, state);
        const path = svgPath(county.path, `county-path ${row.called ? marginClass(row.winner.margin) : 'uncalled'} ${String(county.id) === String(app.selectedCounty) ? 'selected' : ''}`);
        const mapColor = mapDisplayColor(row);
        const fill = row.called ? shadeColor(mapColor, row) : '#64748b';
        appendMapUnderlay(underlay, county.path, fill, row.called);
        path.style.setProperty('--party', mapColor);
        path.style.fill = fill;
        path.style.fillOpacity = row.called ? '1' : '0.32';
        path.dataset.county = county.id;
        path.dataset.tip = tooltipHtml(`${county.name} County`, row, `${state.name} county`);
        path.addEventListener('click', () => {
          app.selectedState = state.abbr;
          app.selectedCounty = String(county.id);
          app.selectedElectoralUnit = '';
          app.selectedSenateClass = '';
          app.editingRace = '';
          renderSelectedRace();
          saveState();
        });
        path.addEventListener('mousemove', moveTip);
        path.addEventListener('mouseenter', showTip);
        path.addEventListener('mouseleave', hideTip);
        svg.appendChild(path);
      });
      return;
    }

    setSvgViewBox(svg, nationalMapViewBoxWithInset(), 'president-states');
    if (modeLabel) modeLabel.textContent = 'States';
    if (title) title.textContent = 'United States';
    if (back) back.style.display = 'none';
    const underlay = createMapUnderlayLayer(svg);
    result.stateResults.forEach(row => {
      const shape = statePathByAbbr.get(row.state.abbr);
      if (!shape) return;
      const path = svgPath(shape.path, `state-path ${row.called ? marginClass(row.winner.margin) : 'uncalled'} ${row.state.abbr === app.selectedState ? 'selected' : ''}`);
      const mapColor = mapDisplayColor(row);
      const fill = row.called ? shadeColor(mapColor, row) : '#64748b';
      appendMapUnderlay(underlay, shape.path, fill, row.called);
      path.style.setProperty('--party', mapColor);
      path.style.fill = fill;
      path.style.fillOpacity = row.called ? '1' : '0.32';
      path.dataset.state = row.state.abbr;
      path.dataset.tip = tooltipHtml(row.state.name, row, `${row.state.ev} electoral points`);
      path.addEventListener('click', () => {
        app.selectedState = row.state.abbr;
        app.selectedCounty = '';
        app.selectedElectoralUnit = '';
        app.selectedSenateClass = '';
        app.editingRace = '';
        renderSelectedRace();
        saveState();
      });
      path.addEventListener('dblclick', () => {
        app.selectedState = row.state.abbr;
        app.selectedCounty = '';
        app.mapMode = 'counties';
        app.selectedElectoralUnit = '';
        app.selectedSenateClass = '';
        app.editingRace = '';
        renderElectionReadouts({ includeMap:true, skipGovernment:true });
        saveState();
      });
      path.addEventListener('mousemove', moveTip);
      path.addEventListener('mouseenter', showTip);
      path.addEventListener('mouseleave', hideTip);
      svg.appendChild(path);
    });
    renderSplitEvDistrictOverlay(svg, result);
    renderSmallStateInset(result, 'president');
  }

  function resetSmallStateInset() {
    const stage = document.getElementById('election-map-stage');
    const inset = document.getElementById('small-state-inset');
    stage?.classList.remove('with-small-state-inset');
    if (!inset) return;
    inset.hidden = true;
    inset.innerHTML = '';
    inset.removeAttribute('data-mode');
  }

  function renderSmallStateInset(result, mode) {
    const stage = document.getElementById('election-map-stage');
    const inset = document.getElementById('small-state-inset');
    if (!stage || !inset) return;
    const rows = new Map((mode === 'senate' ? result.senateResults : result.stateResults)
      .map(row => [row.state.abbr, row]));
    const states = SMALL_STATE_INSET.filter(abbr => mode !== 'senate' || abbr !== 'DC');
    inset.innerHTML = '';
    inset.dataset.mode = mode;
    states.forEach(abbr => {
      const row = rows.get(abbr);
      if (!row) return;
      const baseColor = mode === 'senate' ? senateMapColor(row) : mapDisplayColor(row);
      const fill = row.called ? shadeColor(baseColor, row) : '#64748b';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `small-state-tile inset-${abbr.toLowerCase()} ${row.called ? 'called' : 'uncalled'} ${abbr === app.selectedState ? 'selected' : ''} ${mode === 'senate' && senateMapIsSplit(row) ? 'split' : ''}`;
      button.style.setProperty('--state-fill', fill);
      button.style.setProperty('--state-color', baseColor);
      button.style.setProperty('--state-ink', readableTextColor(fill));
      button.dataset.statePick = abbr;
      button.dataset.modePick = mode;
      button.dataset.tip = mode === 'senate'
        ? tooltipHtml(`${row.state.name} Senate`, senateMapTooltipRow(row), senateSeatSubtitle(row))
        : tooltipHtml(row.state.name, row, `${row.state.ev} electoral points`);
      button.setAttribute('aria-label', mode === 'senate'
        ? `${row.state.name}, two Senate seats`
        : `${row.state.name}, ${row.state.ev} electoral points`);
      button.setAttribute('aria-pressed', abbr === app.selectedState ? 'true' : 'false');
      button.innerHTML = `<strong>${escapeHtml(abbr)}</strong><span>${mode === 'senate' ? '2 seats' : `${row.state.ev} EV`}</span>`;
      button.addEventListener('mousemove', moveTip);
      button.addEventListener('mouseenter', showTip);
      button.addEventListener('mouseleave', hideTip);
      inset.appendChild(button);
    });
    inset.hidden = false;
    stage.classList.add('with-small-state-inset');
  }

  function readableTextColor(hex) {
    const [red, green, blue] = parseHexColor(hex);
    return (red * 299 + green * 587 + blue * 114) / 1000 > 158 ? '#07111f' : '#f8fbff';
  }

  function renderSplitEvDistrictOverlay(svg, result) {
    if (!window.US_HOUSE_MAP_DATA || !result?.unitResults?.length) return;
    const splitStates = Object.keys(SPLIT_EV);
    const byId = new Map(result.unitResults.map(row => [splitEvDistrictId(row.label), row]).filter(([id]) => id));
    const stateRows = new Map((result.stateResults || []).map(row => [row.state.abbr, row]));
    splitStates.forEach(abbr => {
      const transform = splitEvOverlayTransform(abbr);
      (houseDistrictsByState.get(abbr) || []).forEach(district => {
        const row = byId.get(district.id);
        if (!row) return;
        const stateRow = stateRows.get(abbr);
        const stateColor = mapDisplayColor(stateRow);
        const stateFill = stateRow?.called ? shadeColor(stateColor, stateRow) : '#64748b';
        const districtColor = mapDisplayColor(row);
        const districtFill = row.called ? shadeColor(districtColor, row) : stateFill;
        const districtWinner = mapDisplayWinner(row);
        const stateWinner = mapDisplayWinner(stateRow);
        const differentWinner = districtWinner.key && stateWinner.key && districtWinner.key !== stateWinner.key;
        const path = svgPath(district.path, `district-path split-ev-path ${row.called ? marginClass(row.winner.margin) : 'uncalled'} ${abbr === app.selectedState ? 'selected' : ''} ${app.selectedElectoralUnit === row.label ? 'unit-selected' : ''}`);
        if (transform) path.setAttribute('transform', transform);
        path.style.setProperty('--party', districtColor);
        path.style.fill = row.called ? blendHexColors(stateFill, districtFill, differentWinner ? 0.58 : 0.34) : 'transparent';
        path.style.fillOpacity = row.called ? '1' : '0';
        path.style.pointerEvents = 'all';
        path.dataset.state = abbr;
        path.dataset.district = district.id;
        path.dataset.tip = tooltipHtml(row.label, row, `${district.stateName} · ${row.ev} electoral ${row.ev === 1 ? 'point' : 'points'}`);
        path.addEventListener('click', () => {
          app.selectedState = abbr;
          app.selectedCounty = '';
          app.selectedElectoralUnit = row.label;
          app.selectedSenateClass = '';
          app.editingRace = '';
          renderSelectedRace();
          saveState();
        });
        path.addEventListener('dblclick', () => {
          app.selectedState = abbr;
          app.selectedCounty = '';
          app.mapMode = 'counties';
          app.selectedElectoralUnit = '';
          app.selectedSenateClass = '';
          app.editingRace = '';
          renderElectionReadouts({ includeMap:true, skipGovernment:true });
          saveState();
        });
        path.addEventListener('mousemove', moveTip);
        path.addEventListener('mouseenter', showTip);
        path.addEventListener('mouseleave', hideTip);
        svg.appendChild(path);
      });
    });
  }

  function splitEvDistrictId(label) {
    const match = /^([A-Z]{2})-(\d+)$/.exec(String(label || ''));
    return match ? `${match[1]}-${match[2].padStart(2, '0')}` : '';
  }

  function blendHexColors(baseHex, overlayHex, overlayWeight = 0.5) {
    const base = parseHexColor(baseHex);
    const overlay = parseHexColor(overlayHex);
    const weight = clamp(overlayWeight, 0, 1, 0.5);
    return rgbToHex(base.map((channel, index) => Math.round(channel * (1 - weight) + overlay[index] * weight)));
  }

  function splitEvOverlayTransform(abbr) {
    const stateBox = statePathByAbbr.get(abbr)?.bbox;
    const districtBox = unionBbox((houseDistrictsByState.get(abbr) || []).map(district => district.bbox).filter(Boolean));
    if (!stateBox || !districtBox) return '';
    const sx = (stateBox[2] - stateBox[0]) / Math.max(0.01, districtBox[2] - districtBox[0]);
    const sy = (stateBox[3] - stateBox[1]) / Math.max(0.01, districtBox[3] - districtBox[1]);
    const tx = stateBox[0] - districtBox[0] * sx;
    const ty = stateBox[1] - districtBox[1] * sy;
    return `matrix(${sx.toFixed(6)} 0 0 ${sy.toFixed(6)} ${tx.toFixed(3)} ${ty.toFixed(3)})`;
  }

  function unionBbox(boxes) {
    if (!boxes.length) return null;
    return boxes.reduce((box, item) => [
      Math.min(box[0], item[0]),
      Math.min(box[1], item[1]),
      Math.max(box[2], item[2]),
      Math.max(box[3], item[3]),
    ], [Infinity, Infinity, -Infinity, -Infinity]);
  }

  function renderHouseMap(svg, result, modeLabel, title, back) {
    const data = window.US_HOUSE_MAP_DATA;
    if (!data) return;
    setSvgViewBox(svg, data.viewBox || [0, 0, 960, 600], 'house');
    if (modeLabel) modeLabel.textContent = 'House · Census 2025 CD119';
    if (title) title.textContent = 'US House districts';
    if (back) back.style.display = 'none';
    const byId = new Map((result.districtResults || []).map(row => [row.district.id, row]));
    const underlay = createMapUnderlayLayer(svg);
    (data.districts || []).forEach(district => {
      const row = byId.get(district.id) || houseResult(district);
      const path = svgPath(district.path, `district-path ${row.called ? marginClass(row.winner.margin) : 'uncalled'} ${district.id === app.selectedDistrict ? 'selected' : ''}`);
      const mapColor = mapDisplayColor(row);
      const fill = row.called ? shadeColor(mapColor, row) : '#64748b';
      appendMapUnderlay(underlay, district.path, fill, row.called);
      path.style.setProperty('--party', mapColor);
      path.style.fill = fill;
      path.style.fillOpacity = row.called ? '1' : '0.32';
      path.dataset.district = district.id;
      path.dataset.tip = tooltipHtml(district.label, row, `${district.stateName} · ${district.pvi || 'modeled'} · 1 House seat`);
      path.addEventListener('click', () => {
        app.selectedDistrict = district.id;
        app.selectedState = district.state;
        app.selectedCounty = '';
        app.selectedElectoralUnit = '';
        app.selectedSenateClass = '';
        app.editingRace = '';
        renderSelectedRace();
        saveState();
      });
      path.addEventListener('mousemove', moveTip);
      path.addEventListener('mouseenter', showTip);
      path.addEventListener('mouseleave', hideTip);
      svg.appendChild(path);
    });
  }

  function renderSenateMap(svg, result, modeLabel, title, back) {
    setSvgViewBox(svg, nationalMapViewBoxWithInset(), 'senate');
    if (modeLabel) modeLabel.textContent = 'Senate · 100 seats';
    if (title) title.textContent = 'US Senate states';
    if (back) back.style.display = 'none';
    const underlay = createMapUnderlayLayer(svg);
    (result.senateResults || []).forEach(row => {
      const shape = statePathByAbbr.get(row.state.abbr);
      if (!shape) return;
      const mapColor = senateMapColor(row);
      const fill = row.called ? shadeColor(mapColor, row) : '#64748b';
      appendMapUnderlay(underlay, shape.path, fill, row.called);
      const path = svgPath(shape.path, `state-path ${row.called ? marginClass(row.winner.margin) : 'uncalled'} ${senateMapIsSplit(row) ? 'split' : ''} ${row.state.abbr === app.selectedState ? 'selected' : ''}`);
      path.style.setProperty('--party', mapColor);
      path.style.fill = fill;
      path.style.fillOpacity = row.called ? '1' : '0.32';
      path.dataset.state = row.state.abbr;
      path.dataset.tip = tooltipHtml(`${row.state.name} Senate`, senateMapTooltipRow(row), senateSeatSubtitle(row));
      path.addEventListener('click', () => {
        app.selectedState = row.state.abbr;
        app.selectedCounty = '';
        app.selectedElectoralUnit = '';
        app.selectedSenateClass = '';
        app.editingRace = '';
        renderSelectedRace();
        saveState();
      });
      path.addEventListener('mousemove', moveTip);
      path.addEventListener('mouseenter', showTip);
      path.addEventListener('mouseleave', hideTip);
      svg.appendChild(path);
    });
  }

  function svgPath(d, cls) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', cls);
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    return path;
  }

  function createMapUnderlayLayer(svg) {
    const layer = document.createElementNS(SVG_NS, 'g');
    layer.setAttribute('class', 'map-underlay-layer');
    layer.setAttribute('aria-hidden', 'true');
    svg.appendChild(layer);
    return layer;
  }

  function appendMapUnderlay(layer, d, fill, solidFill = true) {
    if (!layer || !d) return;
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'map-underlay-path');
    path.style.fill = solidFill ? fill : 'none';
    path.style.stroke = fill;
    layer.appendChild(path);
  }

  function shadeOpacity(row) {
    const share = Number(row.winner?.pct) || 0;
    return clamp(0.34 + (share - 35) / 30 * 0.62, 0.38, 0.98);
  }

  function shadeColor(hex, row) {
    const color = parseHexColor(hex);
    const neutral = [214, 222, 232];
    const share = Number(row.winner?.pct || 0);
    const margin = Number(row.winner?.margin || 0);
    const strength = shadeStrength(share, margin);
    const mixed = neutral.map((channel, i) => Math.round(channel * (1 - strength) + color[i] * strength));
    const darken = clamp((Math.max(margin, share - 50) - 14) / 28, 0, 0.42);
    return rgbToHex(mixed.map(channel => Math.round(channel * (1 - darken))));
  }

  function mapDisplayWinner(row) {
    const winner = row?.winner || {};
    if (app.settings.mapView === 'party' && winner.mode === 'bloc') {
      const lead = winner.members?.[0];
      const party = lead?.party || winner.party;
      if (!party) return winner;
      return {
        ...winner,
        party,
        key:party.id,
        label:party.short || party.party,
        color:party.color,
        mode:'party',
      };
    }
    const party = winner.party;
    const bloc = party?.bloc ? findBloc(party.bloc) : null;
    const chamberRace = ['district','senate-seat','senate'].includes(row?.kind);
    if (app.settings.mapView === 'bloc' && chamberRace && bloc?.mode === 'coalition') {
      return {
        ...winner,
        key:bloc.name,
        label:bloc.short || shortCode(bloc.name),
        color:bloc.color || party.color,
        displayMode:'coalition',
      };
    }
    return winner;
  }

  function mapDisplayColor(row) {
    const winner = mapDisplayWinner(row);
    return winner.color || winner.party?.color || '#64748b';
  }

  function nationalMapViewBoxWithInset() {
    const box = window.US_ELECTION_MAP_DATA?.viewBox || [0, 0, 960, 600];
    return [box[0], box[1], box[2] + 118, box[3]];
  }

  function senateMapColor(row) {
    const winners = (row.seatResults || []).filter(seat => seat.called && seat.winner.party);
    if (winners.length < 2 || !senateMapIsSplit(row)) return mapDisplayColor(row);
    const rgb = winners.reduce((sum, seat) => {
      const color = parseHexColor(mapDisplayColor(seat));
      return sum.map((channel, index) => channel + color[index]);
    }, [0, 0, 0]).map(channel => Math.round(channel / winners.length));
    return rgbToHex(rgb);
  }

  function senateMapIsSplit(row) {
    const keys = new Set((row?.seatResults || [])
      .filter(seat => seat.called && seat.winner.party)
      .map(seat => mapDisplayWinner(seat).key)
      .filter(Boolean));
    return keys.size > 1;
  }

  function senateMapTooltipRow(row) {
    const splitSeats = senateMapIsSplit(row);
    return splitSeats === row.splitSeats ? row : { ...row, splitSeats };
  }

  function shadeStrength(share, margin) {
    const m = clamp(Number(margin) || 0, 0, 45);
    let strength;
    if (m < 1) strength = 0.22 + m * 0.10;
    else if (m < 3) strength = 0.32 + (m - 1) / 2 * 0.20;
    else if (m < 7) strength = 0.52 + (m - 3) / 4 * 0.26;
    else if (m < 15) strength = 0.78 + (m - 7) / 8 * 0.14;
    else strength = 0.92 + Math.min(0.08, (m - 15) / 30 * 0.08);
    const shareBoost = clamp((Number(share) - 50) / 25, 0, 1) * 0.08;
    return clamp(strength + shareBoost, 0.20, 1);
  }

  function parseHexColor(hex) {
    const cleaned = String(hex || '').replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(cleaned)) return [100, 116, 139];
    return [0, 2, 4].map(i => parseInt(cleaned.slice(i, i + 2), 16));
  }

  function rgbToHex(rgb) {
    return '#' + rgb.map(n => clamp(n, 0, 255, 0).toString(16).padStart(2, '0')).join('');
  }

  function findBloc(name) {
    return findBlocInList(app.blocs, name);
  }

  function blocColor(name, fallback = '#64748b') {
    return findBloc(name)?.color || fallback;
  }

  function partyCoalitionColor(party, fallback = '#64748b') {
    return party?.bloc ? blocColor(party.bloc, party.color || fallback) : (party?.color || fallback);
  }

  function blocOptionsMarkup(selected = '') {
    return `
      <option value="">No bloc</option>
      ${app.blocs.map(bloc => `<option value="${escapeAttr(bloc.name)}" ${bloc.name === selected ? 'selected' : ''}>${escapeHtml(bloc.name)} · ${bloc.mode === 'coalition' ? 'Coalition' : 'Electoral'}</option>`).join('')}
    `;
  }

  const MAP_MIN_ZOOM = 1;
  const MAP_MAX_ZOOM = 32;
  const MAP_BUTTON_ZOOM = 1.6;

  function setSvgViewBox(svg, box, key = 'map') {
    const [x1, y1, x2, y2] = box;
    const base = {
      x:Number(x1) || 0,
      y:Number(y1) || 0,
      width:Math.max(1, (Number(x2) || 0) - (Number(x1) || 0)),
      height:Math.max(1, (Number(y2) || 0) - (Number(y1) || 0)),
    };
    activeMapCameraKey = key;
    let camera = mapCameraByKey.get(key);
    const baseChanged = !camera
      || Math.abs(camera.base.x - base.x) > 0.01
      || Math.abs(camera.base.y - base.y) > 0.01
      || Math.abs(camera.base.width - base.width) > 0.01
      || Math.abs(camera.base.height - base.height) > 0.01;
    if (baseChanged) {
      camera = {
        base,
        zoom:MAP_MIN_ZOOM,
        centerX:base.x + base.width / 2,
        centerY:base.y + base.height / 2,
      };
      mapCameraByKey.set(key, camera);
    } else {
      camera.base = base;
    }
    applyMapCamera(svg);
  }

  function currentMapCamera() {
    return mapCameraByKey.get(activeMapCameraKey) || null;
  }

  function mapCameraView(camera) {
    if (!camera) return null;
    camera.zoom = clamp(camera.zoom, MAP_MIN_ZOOM, MAP_MAX_ZOOM, MAP_MIN_ZOOM);
    const width = camera.base.width / camera.zoom;
    const height = camera.base.height / camera.zoom;
    camera.centerX = clamp(
      camera.centerX,
      camera.base.x + width / 2,
      camera.base.x + camera.base.width - width / 2,
      camera.base.x + camera.base.width / 2
    );
    camera.centerY = clamp(
      camera.centerY,
      camera.base.y + height / 2,
      camera.base.y + camera.base.height - height / 2,
      camera.base.y + camera.base.height / 2
    );
    return {
      x:camera.centerX - width / 2,
      y:camera.centerY - height / 2,
      width,
      height,
    };
  }

  function applyMapCamera(svg = document.getElementById('real-us-map')) {
    const camera = currentMapCamera();
    const view = mapCameraView(camera);
    if (!svg || !camera || !view) return;
    svg.setAttribute('viewBox', `${view.x.toFixed(5)} ${view.y.toFixed(5)} ${view.width.toFixed(5)} ${view.height.toFixed(5)}`);
    svg.classList.toggle('is-zoomed', camera.zoom > MAP_MIN_ZOOM + 0.001);
    updateMapZoomControls(camera.zoom);
  }

  function updateMapZoomControls(zoom = currentMapCamera()?.zoom || MAP_MIN_ZOOM) {
    const level = document.getElementById('map-zoom-level');
    const zoomIn = document.querySelector('[data-action="map-zoom-in"]');
    const zoomOut = document.querySelector('[data-action="map-zoom-out"]');
    const reset = document.querySelector('[data-action="map-zoom-reset"]');
    if (level) level.textContent = `${Math.round(zoom * 100)}%`;
    if (zoomIn) zoomIn.disabled = zoom >= MAP_MAX_ZOOM - 0.001;
    if (zoomOut) zoomOut.disabled = zoom <= MAP_MIN_ZOOM + 0.001;
    if (reset) reset.disabled = zoom <= MAP_MIN_ZOOM + 0.001;
  }

  function mapClientPoint(svg, clientX, clientY) {
    try {
      const point = svg.createSVGPoint();
      point.x = clientX;
      point.y = clientY;
      const matrix = svg.getScreenCTM();
      if (matrix) return point.matrixTransform(matrix.inverse());
    } catch (e) {}
    const rect = svg.getBoundingClientRect();
    const view = mapCameraView(currentMapCamera());
    if (!view || !rect.width || !rect.height) return null;
    return {
      x:view.x + (clientX - rect.left) / rect.width * view.width,
      y:view.y + (clientY - rect.top) / rect.height * view.height,
    };
  }

  function setMapZoom(nextZoom, anchor = null) {
    const camera = currentMapCamera();
    if (!camera) return;
    const previousZoom = camera.zoom;
    const zoom = clamp(nextZoom, MAP_MIN_ZOOM, MAP_MAX_ZOOM, previousZoom);
    if (Math.abs(zoom - previousZoom) < 0.0001) return;
    if (anchor) {
      const ratio = previousZoom / zoom;
      camera.centerX = anchor.x + (camera.centerX - anchor.x) * ratio;
      camera.centerY = anchor.y + (camera.centerY - anchor.y) * ratio;
    }
    camera.zoom = zoom;
    applyMapCamera();
  }

  function zoomMapBy(factor) {
    const camera = currentMapCamera();
    if (camera) setMapZoom(camera.zoom * factor);
  }

  function resetMapCamera() {
    const camera = currentMapCamera();
    if (!camera) return;
    camera.zoom = MAP_MIN_ZOOM;
    camera.centerX = camera.base.x + camera.base.width / 2;
    camera.centerY = camera.base.y + camera.base.height / 2;
    applyMapCamera();
  }

  function mapScreenScale(svg) {
    try {
      const matrix = svg.getScreenCTM();
      if (matrix) {
        return {
          x:Math.max(0.0001, Math.hypot(matrix.a, matrix.b)),
          y:Math.max(0.0001, Math.hypot(matrix.c, matrix.d)),
        };
      }
    } catch (e) {}
    const rect = svg.getBoundingClientRect();
    const view = mapCameraView(currentMapCamera());
    return {
      x:Math.max(0.0001, rect.width / Math.max(1, view?.width || 1)),
      y:Math.max(0.0001, rect.height / Math.max(1, view?.height || 1)),
    };
  }

  function startMapPan(svg, pointer) {
    const camera = currentMapCamera();
    if (!camera || !pointer) return;
    const scale = mapScreenScale(svg);
    mapGesture = {
      type:'pan',
      pointerId:pointer.id,
      startX:pointer.x,
      startY:pointer.y,
      startCenterX:camera.centerX,
      startCenterY:camera.centerY,
      scaleX:scale.x,
      scaleY:scale.y,
      dragged:false,
    };
  }

  function startMapPinch(svg) {
    const camera = currentMapCamera();
    const pointers = [...mapPointers.values()].slice(0, 2);
    if (!camera || pointers.length < 2) return;
    const midpoint = {
      x:(pointers[0].x + pointers[1].x) / 2,
      y:(pointers[0].y + pointers[1].y) / 2,
    };
    const scale = mapScreenScale(svg);
    mapGesture = {
      type:'pinch',
      ids:pointers.map(pointer => pointer.id),
      startDistance:Math.max(1, Math.hypot(pointers[1].x - pointers[0].x, pointers[1].y - pointers[0].y)),
      startMidpoint:midpoint,
      startZoom:camera.zoom,
      startCenterX:camera.centerX,
      startCenterY:camera.centerY,
      anchor:mapClientPoint(svg, midpoint.x, midpoint.y) || { x:camera.centerX, y:camera.centerY },
      scaleX:scale.x,
      scaleY:scale.y,
      dragged:true,
    };
    pointers.forEach(pointer => {
      try { svg.setPointerCapture?.(pointer.id); } catch (e) {}
    });
    svg.classList.add('is-panning');
    hideTip();
  }

  function updateMapGesture(svg, event) {
    if (!mapGesture) return;
    const camera = currentMapCamera();
    if (!camera) return;
    if (mapPointers.size >= 2) {
      if (mapGesture.type !== 'pinch' || !mapGesture.ids.every(id => mapPointers.has(id))) startMapPinch(svg);
      const pointers = mapGesture.ids.map(id => mapPointers.get(id)).filter(Boolean);
      if (pointers.length < 2) return;
      const midpoint = {
        x:(pointers[0].x + pointers[1].x) / 2,
        y:(pointers[0].y + pointers[1].y) / 2,
      };
      const distance = Math.max(1, Math.hypot(pointers[1].x - pointers[0].x, pointers[1].y - pointers[0].y));
      const zoom = clamp(mapGesture.startZoom * distance / mapGesture.startDistance, MAP_MIN_ZOOM, MAP_MAX_ZOOM, mapGesture.startZoom);
      const ratio = mapGesture.startZoom / zoom;
      camera.zoom = zoom;
      camera.centerX = mapGesture.anchor.x + (mapGesture.startCenterX - mapGesture.anchor.x) * ratio
        - (midpoint.x - mapGesture.startMidpoint.x) / mapGesture.scaleX * ratio;
      camera.centerY = mapGesture.anchor.y + (mapGesture.startCenterY - mapGesture.anchor.y) * ratio
        - (midpoint.y - mapGesture.startMidpoint.y) / mapGesture.scaleY * ratio;
      applyMapCamera(svg);
      event.preventDefault();
      return;
    }
    if (mapGesture.type !== 'pan') return;
    const pointer = mapPointers.get(mapGesture.pointerId);
    if (!pointer) return;
    const dx = pointer.x - mapGesture.startX;
    const dy = pointer.y - mapGesture.startY;
    if (!mapGesture.dragged && Math.hypot(dx, dy) > 3 && camera.zoom > MAP_MIN_ZOOM + 0.001) {
      mapGesture.dragged = true;
      try { svg.setPointerCapture?.(event.pointerId); } catch (e) {}
      svg.classList.add('is-panning');
      hideTip();
    }
    if (!mapGesture.dragged) return;
    camera.centerX = mapGesture.startCenterX - dx / mapGesture.scaleX;
    camera.centerY = mapGesture.startCenterY - dy / mapGesture.scaleY;
    applyMapCamera(svg);
    event.preventDefault();
  }

  function finishMapPointer(svg, event) {
    const dragged = !!mapGesture?.dragged;
    mapPointers.delete(event.pointerId);
    try { svg.releasePointerCapture?.(event.pointerId); } catch (e) {}
    if (dragged) suppressMapClickUntil = Date.now() + 320;
    if (mapPointers.size === 1) startMapPan(svg, [...mapPointers.values()][0]);
    else if (mapPointers.size >= 2) startMapPinch(svg);
    else mapGesture = null;
    if (mapPointers.size < 2 && !mapGesture?.dragged) svg.classList.remove('is-panning');
    if (!mapPointers.size) svg.classList.remove('is-panning');
  }

  function panMapByKeyboard(svg, horizontal, vertical) {
    const camera = currentMapCamera();
    const view = mapCameraView(camera);
    if (!camera || !view || camera.zoom <= MAP_MIN_ZOOM + 0.001) return;
    camera.centerX += horizontal * view.width * 0.12;
    camera.centerY += vertical * view.height * 0.12;
    applyMapCamera(svg);
  }

  function installMapNavigation() {
    const svg = document.getElementById('real-us-map');
    if (!svg || svg.dataset.navigationBound) return;
    svg.dataset.navigationBound = '1';
    svg.addEventListener('wheel', event => {
      const camera = currentMapCamera();
      if (!camera) return;
      event.preventDefault();
      hideTip();
      const anchor = mapClientPoint(svg, event.clientX, event.clientY);
      const factor = Math.exp(-event.deltaY * 0.0018);
      setMapZoom(camera.zoom * factor, anchor);
    }, { passive:false });
    svg.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      mapPointers.set(event.pointerId, { id:event.pointerId, x:event.clientX, y:event.clientY });
      if (mapPointers.size >= 2) startMapPinch(svg);
      else startMapPan(svg, mapPointers.get(event.pointerId));
    });
    svg.addEventListener('pointermove', event => {
      if (!mapPointers.has(event.pointerId)) return;
      mapPointers.set(event.pointerId, { id:event.pointerId, x:event.clientX, y:event.clientY });
      updateMapGesture(svg, event);
    });
    svg.addEventListener('pointerup', event => finishMapPointer(svg, event));
    svg.addEventListener('pointercancel', event => finishMapPointer(svg, event));
    svg.addEventListener('click', event => {
      if (Date.now() >= suppressMapClickUntil) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    svg.addEventListener('keydown', event => {
      if (event.key === '+' || event.key === '=') zoomMapBy(MAP_BUTTON_ZOOM);
      else if (event.key === '-' || event.key === '_') zoomMapBy(1 / MAP_BUTTON_ZOOM);
      else if (event.key === '0' || event.key === 'Home') resetMapCamera();
      else if (event.key === 'ArrowLeft') panMapByKeyboard(svg, -1, 0);
      else if (event.key === 'ArrowRight') panMapByKeyboard(svg, 1, 0);
      else if (event.key === 'ArrowUp') panMapByKeyboard(svg, 0, -1);
      else if (event.key === 'ArrowDown') panMapByKeyboard(svg, 0, 1);
      else return;
      event.preventDefault();
    });
  }

  function paddedBbox(box, pad) {
    const [x1, y1, x2, y2] = box;
    return [x1 - pad, y1 - pad, x2 + pad, y2 + pad];
  }

  function marginClass(margin) {
    const m = Math.abs(Number(margin) || 0);
    if (m < 1.5) return 'tossup';
    if (m < 5) return 'lean';
    if (m < 10) return 'likely';
    return 'safe';
  }

  function tooltipHtml(title, row, subtitle) {
    if (!row.called) {
      const reportingText = row.kind === 'senate'
        ? 'state not yet called'
        : row.countyReportingPct === undefined
        ? (row.kind === 'district' ? 'district not yet called' : 'county not yet called')
        : `${Math.round(row.countyReportingPct || 0)}% county vote in`;
      return `
        <strong>${escapeHtml(title)}</strong>
        <em>${escapeHtml(subtitle)} · not called · ${Math.round(row.callThreshold || 0)}% call schedule · ${reportingText}</em>
      `;
    }
    if (row.kind === 'senate') {
      return `
        <strong>${escapeHtml(title)}</strong>
        <em>${escapeHtml(subtitle)} · CALLED · ${row.splitSeats ? 'split delegation' : `${escapeHtml(winnerShortLabel(row.winner))} leads`} · ${formatVotes(row.totalVotes)} votes</em>
        ${senateSeatRows(row, 'tip')}
      `;
    }
    const rows = row.shares.slice(0, 6).map(share => `
      <div class="election-tip-row">
        <i style="background:${escapeAttr(share.party.color)}"></i>
        <span>${escapeHtml(share.party.short)} ${escapeHtml(share.party.candidate || share.party.party)}</span>
        <strong>${pct(share.pct)} · ${compactVotes(share.votes)}</strong>
      </div>
    `).join('');
    return `
      <strong>${escapeHtml(title)}</strong>
      <em>${escapeHtml(subtitle)} · CALLED · ${escapeHtml(winnerShortLabel(row.winner))} +${marginText(row.winner.margin)}${row.winner.mode === 'bloc' ? ` · ${escapeHtml(row.winner.label)} bloc ${pct(row.winner.pct)}` : ''}</em>
      ${rows}
    `;
  }

  function raceWinnerPortrait(row) {
    if (!row.called || !row.winner.party) return '';
    const lead = row.winner.members?.[0]?.party || row.winner.party;
    const partners = row.winner.mode === 'bloc'
      ? (row.winner.members || []).slice(1).map(member => member.party).filter(Boolean)
      : [];
    return `
      <div class="race-winner-stack">
        ${partyPortrait(lead, 'race-winner-photo')}
        ${partners.length ? `<div class="race-bloc-partners">${partners.map(party => partyPortrait(party, 'race-partner-photo')).join('')}</div>` : ''}
      </div>
    `;
  }

  function partyPortrait(party, cls) {
    if (!party) {
      return `<div class="${cls} portrait-placeholder" title="No party selected"><span>?</span></div>`;
    }
    const imageStyle = party?.image ? `style="background-image:url('${escapeAttr(party.image)}')"` : '';
    return `<div class="${cls} ${party?.image ? 'has-image' : ''}" ${imageStyle} title="${escapeAttr(party?.candidate || party?.party || '')}"><span>${escapeHtml(initials(party?.candidate || party?.party))}</span></div>`;
  }

  function winnerShortLabel(winner) {
    return winner?.party?.short || winner?.label || '---';
  }

  function blocWinnerMeta(row) {
    if (row.winner.mode !== 'bloc') return '';
    return ` · ${escapeHtml(row.winner.label)} bloc ${pct(row.winner.pct)}`;
  }

  function sideLabel(side) {
    if (side === 'left') return 'left';
    if (side === 'right') return 'right';
    return 'center';
  }

  function senateSeatLeanLabel(seat) {
    const margin = Number(seat?.margin);
    if (!Number.isFinite(margin)) return sideLabel(seat?.side);
    if (Math.abs(margin) < 0.05) return 'even';
    return `${margin < 0 ? 'D' : 'R'}+${Math.abs(margin).toFixed(1)}`;
  }

  function senateSeatDisplayName(seatResult) {
    const seat = seatResult?.senateSeat || seatResult || {};
    const side = senateDisplayCandidateSide(seatResult);
    if (side === 'dem') return seat.demName || (seat.side === 'left' ? seat.name : '') || 'Democratic nominee';
    if (side === 'rep') return seat.repName || (seat.side === 'right' ? seat.name : '') || 'Republican nominee';
    return seat.name || seat.demName || seat.repName || '';
  }

  function senateDisplayCandidateSide(seatResult) {
    const seat = seatResult?.senateSeat || seatResult || {};
    const party = seatResult?.winner?.party;
    if (party) return senateCandidateSideForParty(party, seat);
    const margin = Number(seat.margin);
    if (Number.isFinite(margin) && Math.abs(margin) >= 0.05) return margin < 0 ? 'dem' : 'rep';
    if (seat.side === 'left') return 'dem';
    if (seat.side === 'right') return 'rep';
    return '';
  }

  function senateCandidateSideForParty(party, seat = {}) {
    const alignment = partyAlignmentScore(party);
    const demDistance = Math.abs(alignment - 32);
    const repDistance = Math.abs(alignment - 68);
    if (Math.abs(demDistance - repDistance) <= 3) {
      const margin = Number(seat.margin);
      if (Number.isFinite(margin) && Math.abs(margin) >= 0.05) return margin < 0 ? 'dem' : 'rep';
      if (seat.side === 'left') return 'dem';
      if (seat.side === 'right') return 'rep';
    }
    return demDistance <= repDistance ? 'dem' : 'rep';
  }

  function senateSeatSubtitle(row) {
    const seats = row.seatResults || [];
    if (!seats.length) return '2 Senate seats';
    return `2 Senate seats · ${seats.map(seat => `${seat.senateSeat.label} ${senateSeatLeanLabel(seat.senateSeat)}`).join(' / ')}`;
  }

  function senateSeatRows(row, variant = 'card') {
    const seats = row.seatResults || [];
    if (!seats.length) return '';
    if (variant === 'tip') {
      return seats.map(seat => `
        <div class="election-tip-row">
          <i style="background:${escapeAttr(seat.called ? (seat.winner.color || seat.winner.party?.color || '#64748b') : '#64748b')}"></i>
          <span>${escapeHtml(seat.senateSeat.label)} · ${escapeHtml(senateSeatLeanLabel(seat.senateSeat))} · ${escapeHtml(senateSeatDisplayName(seat))}</span>
          <strong>${seat.called ? `${escapeHtml(winnerShortLabel(seat.winner))} +${marginText(seat.winner.margin)}` : 'not called'}</strong>
        </div>
      `).join('');
    }
    return `
      <div class="senate-seat-list">
        ${seats.map(seat => `
          <div class="senate-seat-row ${seat.called ? 'called' : 'pending'}">
            <span><i style="background:${escapeAttr(seat.called ? (seat.winner.color || seat.winner.party?.color || '#64748b') : '#64748b')}"></i>${escapeHtml(seat.senateSeat.label)} · ${escapeHtml(senateSeatLeanLabel(seat.senateSeat))}</span>
            <b>${escapeHtml(senateSeatDisplayName(seat))}</b>
            <em>${seat.called ? `${escapeHtml(winnerShortLabel(seat.winner))} +${marginText(seat.winner.margin)}` : `${Math.round(seat.callThreshold || 0)}% call`}</em>
            <button class="race-unit-edit" data-action="edit-senate-seat" data-senate-class="${escapeAttr(seat.senateSeat.class)}">Edit</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  function splitElectorRows(rows = []) {
    if (!rows.length) return '';
    return `
      <div class="senate-seat-list split-elector-list">
        ${rows.map(unit => `
          <div class="senate-seat-row ${unit.called ? 'called' : 'pending'}">
            <span>
              <i style="background:${escapeAttr(unit.called ? (unit.winner.color || unit.winner.party?.color || '#64748b') : '#64748b')}"></i>
              ${escapeHtml(unit.label)}
            </span>
            <b>${unit.ev} electoral ${unit.ev === 1 ? 'point' : 'points'}</b>
            <em>${unit.called ? `${escapeHtml(winnerShortLabel(unit.winner))} +${marginText(unit.winner.margin)}` : `${Math.round(unit.callThreshold || 0)}% call`}</em>
            <button class="race-unit-edit" data-action="edit-electoral-unit" data-electoral-unit="${escapeAttr(unit.label)}">Edit</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  function selectedRaceTarget(result) {
    if (app.electionMode === 'house') {
      const district = houseDistrictById.get(app.selectedDistrict) || houseDistricts[0];
      if (district) {
        const row = (result.districtResults || []).find(item => item.district.id === district.id) || houseResult(district);
        return {
          kind:'district',
          id:district.id,
          title:district.label,
          subtitle:`${district.stateName} · ${district.pvi || 'modeled'} · 1 House seat`,
          row,
          state:row.state,
        };
      }
    }
    if (app.electionMode === 'senate') {
      const state = SENATE_STATE_META.find(item => item.abbr === app.selectedState) || stateByAbbr.get('PA');
      const row = (result.senateResults || []).find(item => item.state.abbr === state.abbr) || senateResult(state);
      const selectedSeat = app.selectedSenateClass
        ? (row.seatResults || []).find(item => String(item.senateSeat.class) === String(app.selectedSenateClass))
        : null;
      if (selectedSeat) {
        return {
          kind:'senate-seat',
          id:`${state.abbr}:${selectedSeat.senateSeat.class}`,
          title:`${state.name} Senate · ${selectedSeat.senateSeat.label}`,
          subtitle:`${senateSeatLeanLabel(selectedSeat.senateSeat)} · 1 Senate seat`,
          row:selectedSeat,
          state,
          parent:'senate',
          editLabel:'Edit class',
        };
      }
      return {
        kind:'senate',
        id:state.abbr,
        title:`${state.name} Senate`,
        subtitle:senateSeatSubtitle(row),
        row,
        state,
        editLabel:'Edit both',
      };
    }
    const state = stateByAbbr.get(app.selectedState) || stateByAbbr.get('PA');
    if (app.mapMode === 'counties' && app.selectedCounty) {
      const county = (countiesByState.get(state.abbr) || []).find(item => String(item.id) === String(app.selectedCounty));
      if (county) {
        const row = countyResult(county, state);
        return {
          kind:'county',
          id:String(county.id),
          title:`${county.name} County`,
          subtitle:`${state.name} county`,
          row,
          state,
        };
      }
    }
    const row = result.stateResults.find(item => item.state.abbr === state.abbr) || stateResult(state);
    const splitUnits = SPLIT_EV[state.abbr]
      ? (result.unitResults || []).filter(item => item.label === `${state.abbr} statewide` || item.label.startsWith(`${state.abbr}-`))
      : [];
    const selectedUnit = app.selectedElectoralUnit
      ? splitUnits.find(item => item.label === app.selectedElectoralUnit)
      : null;
    if (selectedUnit) {
      return {
        kind:'electoral-unit',
        id:selectedUnit.label,
        title:selectedUnit.label.endsWith(' statewide')
          ? `${state.name} statewide electors`
          : `${selectedUnit.label} elector`,
        subtitle:`${state.name} · ${selectedUnit.ev} electoral ${selectedUnit.ev === 1 ? 'point' : 'points'}`,
        row:selectedUnit,
        state,
        parent:'state',
        editLabel:'Edit unit',
      };
    }
    return {
      kind:'state',
      id:state.abbr,
      title:state.name,
      subtitle:`${state.ev} electoral points`,
      row,
      state,
      splitUnits,
      editLabel:splitUnits.length ? 'Edit state vote' : 'Edit',
    };
  }

  function raceTargetKey(target) {
    return `${target.kind}:${target.id}`;
  }

  function renderRaceEditForm(target) {
    const shareByParty = new Map(target.row.shares.map(share => [share.party.id, share.pct]));
    return `
      <div class="race-edit-form" data-race-kind="${escapeAttr(target.kind)}" data-race-id="${escapeAttr(target.id)}">
        ${app.parties.map(party => {
          const value = Number(shareByParty.get(party.id) || 0);
          return `
          <label class="race-edit-row" style="--party:${escapeAttr(party.color)}">
            <span>
              <b><i></i>${escapeHtml(party.short)}</b>
              <output data-race-edit-output="${escapeAttr(party.id)}">${value.toFixed(1)}%</output>
            </span>
            <input type="range" min="0" max="100" step="0.1" value="${value.toFixed(1)}" style="--value:${value.toFixed(2)}%" data-race-edit-party="${escapeAttr(party.id)}" aria-label="${escapeAttr(party.party)} vote share" />
          </label>
        `;
        }).join('')}
        <div class="race-edit-actions">
          <span class="race-edit-live" style="--party:${escapeAttr(target.row.winner.color || target.row.winner.party?.color || '#64748b')}">Live · ${escapeHtml(winnerShortLabel(target.row.winner))} ${pct(target.row.winner.pct)}</span>
        </div>
      </div>
    `;
  }

  function applyRaceEditSlider(input) {
    const form = input.closest('.race-edit-form');
    const kind = form?.dataset.raceKind;
    const id = form?.dataset.raceId;
    const changedPartyId = input.dataset.raceEditParty;
    if (!form || !kind || !id || !changedPartyId) return;
    const inputs = [...form.querySelectorAll('[data-race-edit-party]')];
    const others = inputs.filter(item => item !== input);
    const changedValue = others.length ? clamp(input.value, 0, 100, 0) : 100;
    const remaining = Math.max(0, 100 - changedValue);
    const previousOtherTotal = others.reduce((sum, item) => sum + Math.max(0, Number(item.value) || 0), 0);
    const shares = { [changedPartyId]:changedValue };
    let allocated = 0;
    others.forEach((item, index) => {
      const partyId = item.dataset.raceEditParty;
      const value = index === others.length - 1
        ? Math.max(0, remaining - allocated)
        : previousOtherTotal > 0
        ? remaining * Math.max(0, Number(item.value) || 0) / previousOtherTotal
        : remaining / Math.max(1, others.length);
      shares[partyId] = value;
      allocated += value;
    });
    inputs.forEach(item => {
      const value = shares[item.dataset.raceEditParty] || 0;
      item.value = value.toFixed(1);
      item.style.setProperty('--value', `${value.toFixed(2)}%`);
      const output = form.querySelector(`[data-race-edit-output="${cssEscape(item.dataset.raceEditParty)}"]`);
      if (output) output.textContent = `${value.toFixed(1)}%`;
    });
    setRaceEdit(kind, id, shares);
    const result = calculateElection();
    renderCountLine(result);
    renderChamberGraph(result);
    renderMap(result);
    renderControls();
    refreshRaceEditLiveStatus(form, result);
    queueGovernmentRender();
    queueSaveState();
  }

  function refreshRaceEditLiveStatus(form, result) {
    const live = form?.querySelector('.race-edit-live');
    if (!live) return;
    const target = selectedRaceTarget(result);
    if (`${target.kind}:${target.id}` !== `${form.dataset.raceKind}:${form.dataset.raceId}`) return;
    const winner = target.row.winner;
    live.textContent = `Live · ${winnerShortLabel(winner)} ${pct(winner.pct)}`;
    live.style.setProperty('--party', winner.color || winner.party?.color || '#64748b');
  }

  function pendingRaceText(target, row) {
    if (target.kind === 'district') return `${Math.round(row.callThreshold || 0)}% call schedule · district gray until call`;
    if (target.kind === 'electoral-unit') return `${Math.round(row.callThreshold || 0)}% call schedule · electoral unit gray until call`;
    if (target.kind === 'senate-seat') return `${Math.round(row.callThreshold || 0)}% call schedule · Senate class gray until call`;
    if (target.kind === 'senate') return `${Math.round(row.callThreshold || 0)}% call schedule · state gray until call`;
    return `${Math.round(row.countyReportingPct || 0)}% county vote in · ${target.kind === 'state' ? 'state gray until call' : 'county gray until call'}`;
  }

  function renderSidebar(result) {
    const target = selectedRaceTarget(result);
    const row = target.row;
    const targetKey = raceTargetKey(target);
    const editing = app.editingRace === targetKey;
    const relatedEditCount = relatedRaceEditEntries(target.kind, target.id).length;
    const edited = relatedEditCount > 0;
    const selectedCard = document.getElementById('selected-race-card');
    if (selectedCard) {
      const raceCallColor = row.called ? (row.winner.color || row.winner.party?.color || '#64748b') : '#64748b';
      setStableMarkup(selectedCard, `
        <div class="race-card-head">
          <div>
            <span class="election-kicker">Selected race</span>
            <h3>${escapeHtml(target.title)}</h3>
          </div>
          <div class="race-card-actions">
            ${target.parent ? '<button class="election-btn small" data-action="back-race-parent">All races</button>' : ''}
            <button class="election-btn small" data-action="toggle-race-edit" data-race-kind="${escapeAttr(target.kind)}" data-race-id="${escapeAttr(target.id)}">${editing ? 'Close edit' : escapeHtml(target.editLabel || 'Edit')}</button>
            ${edited ? `<button class="election-btn small race-reset-edits" data-action="reset-race-edit" data-race-kind="${escapeAttr(target.kind)}" data-race-id="${escapeAttr(target.id)}">Reset${relatedEditCount > 1 ? ` (${relatedEditCount})` : ''}</button>` : ''}
          </div>
        </div>
        <div class="race-call ${row.called ? 'called' : 'pending'}" style="--party:${escapeAttr(raceCallColor)}">
          <div class="race-call-inner">
            ${raceWinnerPortrait(row)}
            <div class="race-call-copy">
              <strong>${row.called ? escapeHtml(winnerShortLabel(row.winner)) : 'Not called'} ${row.called ? '+' + marginText(row.winner.margin) : ''}</strong>
              <span>${target.subtitle} · ${row.called ? `called · ${formatVotes(row.totalVotes)} votes${blocWinnerMeta(row)}` : pendingRaceText(target, row)} · ${app.settings.coalitionMode ? 'bloc mode' : 'party mode'}${row.edited ? ' · edited' : ''}</span>
            </div>
          </div>
        </div>
        ${target.kind === 'senate' ? senateSeatRows(row) : ''}
        ${target.kind === 'state' && target.splitUnits?.length ? splitElectorRows(target.splitUnits) : ''}
        ${editing ? renderRaceEditForm(target) : ''}
        ${row.called ? `<div class="race-bars">
          ${row.shares.slice(0, 5).map(share => `
            <div class="race-bar-row">
              <span><i style="background:${escapeAttr(share.party.color)}"></i>${escapeHtml(share.party.short)}</span>
              <b><span>${pct(share.pct)}</span><em>${formatVotes(share.votes)}</em></b>
              <div><em style="width:${share.pct.toFixed(2)}%;background:${escapeAttr(share.party.color)}"></em></div>
            </div>
          `).join('')}
        </div>` : `<div class="race-pending">Percentages are hidden until the ${target.kind === 'district' ? 'district' : target.kind === 'senate' ? 'state' : target.kind === 'senate-seat' ? 'Senate class' : target.kind === 'electoral-unit' ? 'electoral unit' : target.kind} is called.</div>`}
      `);
    }
    const battleCard = document.getElementById('battle-card');
    if (battleCard) {
      setStableMarkup(battleCard, `
        <span class="election-kicker">${escapeHtml(result.battleLabel || 'Closest called states')}</span>
        ${result.battlegrounds.length ? `<div class="battle-list">
          ${result.battlegrounds.map(item => `
            <button ${item.district ? `data-district-pick="${escapeAttr(item.district.id)}"` : `data-state-pick="${escapeAttr(item.state.abbr)}" data-mode-pick="${escapeAttr(result.mode === 'senate' ? 'senate' : 'president')}"`}>
              <span>${escapeHtml(item.district?.label || item.label || item.state.abbr)}</span>
              <strong style="color:${escapeAttr(item.winner.color || item.winner.party?.color || '#94a3b8')}">${escapeHtml(winnerShortLabel(item.winner))}</strong>
              <em>+${marginText(item.winner.margin)}</em>
            </button>
          `).join('')}
        </div>` : '<div class="race-pending">Called races under 10 points will appear here once counting finishes.</div>'}
      `);
    }
  }

  function renderPartyDrawer() {
    const drawer = document.getElementById('party-drawer');
    const list = document.getElementById('party-editor-list');
    if (!drawer || !list) return;
    drawer.classList.toggle('open', app.partiesOpen);
    if (!app.partiesOpen) return;
    const signature = partyDrawerSignature();
    if (signature === lastPartyDrawerSignature && !forcedOpenPartyId) return;
    lastPartyDrawerSignature = signature;
    renderBlocBuilder();
    const openDetails = openPartyDetails(list);
    if (forcedOpenPartyId) openDetails.add(forcedOpenPartyId);
    const stateOptions = STATE_META.map(state => `<option value="${state.abbr}">${state.abbr} · ${escapeHtml(state.name)}</option>`).join('');
    list.innerHTML = app.parties.map((party, index) => {
      const imageStyle = party.image ? `style="background-image:url('${escapeAttr(party.image)}')"` : '';
      const presetOptions = [
        `<option value="" ${party.profile ? '' : 'selected'}>Custom profile</option>`,
        ...PROFILE_PRESETS.map(preset => `<option value="${preset.key}" ${party.profile === preset.key ? 'selected' : ''}>${escapeHtml(preset.label)}</option>`),
      ].join('');
      const blocOptions = blocOptionsMarkup(party.bloc);
      const uploadVisible = imageNeedsUpload(party) || party.image;
      const strongholds = Object.entries(party.strongholds).sort().map(([abbr, boost]) => `
        <div class="boost-chip">
          <span><b>${escapeHtml(abbr)}</b><em>${escapeHtml(stateByAbbr.get(abbr)?.name || abbr)}</em></span>
          <input type="range" min="1" max="25" step="1" value="${escapeAttr(boost)}" data-boost-slider="${escapeAttr(abbr)}" aria-label="${escapeAttr(abbr)} stronghold boost" />
          <output>${Math.round(Number(boost) || 0)}</output>
          <button data-action="remove-boost" data-party="${escapeAttr(party.id)}" data-state="${escapeAttr(abbr)}">x</button>
        </div>
      `).join('') || '<span class="drawer-empty">No strongholds yet.</span>';
      return `
        <article class="party-edit-card" data-party="${escapeAttr(party.id)}" style="--party:${escapeAttr(party.color)}">
          <div class="party-edit-main">
            <div class="edit-photo ${party.image ? 'has-image' : ''}" ${imageStyle}><span>${escapeHtml(initials(party.candidate || party.party))}</span></div>
            <div class="edit-fields">
              <div class="edit-line three">
                <input value="${escapeAttr(party.candidate)}" data-field="candidate" placeholder="Candidate name" />
                <input value="${escapeAttr(party.short)}" data-field="short" maxlength="3" />
                <input type="color" value="${escapeAttr(party.color)}" data-field="color" />
              </div>
              <div class="edit-line two">
                <input value="${escapeAttr(party.party)}" data-field="party" placeholder="Full party name" />
                <select data-field="bloc" title="Bloc / coalition">${blocOptions}</select>
              </div>
              <div class="image-status-row">
                <span class="image-status">${escapeHtml(party.imageStatus || (party.image ? 'Picture ready' : 'Type candidate for picture'))}</span>
                <label class="image-upload ${uploadVisible ? 'visible' : ''}">
                  <input type="file" accept="image/*" data-image-upload="${escapeAttr(party.id)}" />
                  <span>${party.image ? 'Replace photo' : 'Upload photo'}</span>
                </label>
              </div>
            </div>
            <button class="remove-party" data-action="remove-party" data-party="${escapeAttr(party.id)}">x</button>
          </div>
          <details class="party-dropdown" ${openDetails.has(party.id) ? 'open' : ''}>
            <summary>Political profile, vote, ballot access, and strongholds</summary>
            <div class="preset-row">
              <select data-preset>${presetOptions}</select>
              <button class="election-btn small" data-action="apply-preset" data-party="${escapeAttr(party.id)}">Apply profile</button>
            </div>
            <div class="slider-grid">
              ${editorSlider('social', 'Social', party.social, 'Conservative', 'Progressive')}
              ${editorSlider('economic', 'Economic', party.economic, 'Free market', 'State')}
              ${editorSlider('geography', 'Rural / metropolitan', party.geography, 'Rural', 'Metropolitan')}
              ${editorSlider('populism', 'Entrenched / populist', party.populism, 'Entrenched', 'Populist')}
              ${editorSlider('base', party.ballotAccess === 'states' ? 'Vote in selected states' : 'National vote', party.base, 'Floor', 'Ceiling', 0.1, 100, 0.1, '%')}
            </div>
            ${partyBallotAccessMarkup(party)}
            <div class="boost-add">
              <select data-new-boost-state>${stateOptions}</select>
              <button class="election-btn small" data-action="add-boost" data-party="${escapeAttr(party.id)}">Add stronghold</button>
            </div>
            <div class="boost-list">${strongholds}</div>
          </details>
        </article>
      `;
    }).join('');
    forcedOpenPartyId = '';
  }

  function partyBallotAccessMarkup(party) {
    const selected = new Set(party.ballotStates || []);
    const stateCount = selected.size;
    const selectedMode = party.ballotAccess === 'states';
    const accessLabel = selectedMode
      ? `${stateCount} state${stateCount === 1 ? '' : 's'}`
      : 'Nationwide';
    const contribution = partyEffectiveNationalBase(party);
    return `
      <section class="ballot-access-config ${selectedMode ? 'state-limited' : 'nationwide'}" data-ballot-config="${escapeAttr(party.id)}">
        <div class="ballot-access-head">
          <div>
            <strong>Ballot access</strong>
            <span data-ballot-summary>${escapeHtml(accessLabel)} · ${contribution.toFixed(1)} effective national points</span>
          </div>
          <div class="ballot-mode-control" aria-label="${escapeAttr(party.party)} ballot access">
            <button class="${selectedMode ? '' : 'active'}" data-action="set-ballot-mode" data-party="${escapeAttr(party.id)}" data-ballot-mode="nationwide" type="button">Nationwide</button>
            <button class="${selectedMode ? 'active' : ''}" data-action="set-ballot-mode" data-party="${escapeAttr(party.id)}" data-ballot-mode="states" type="button">Selected states</button>
          </div>
        </div>
        ${selectedMode ? `
          <div class="ballot-access-tools">
            <span>Party appears only on checked-state ballots</span>
            <div>
              <button data-action="select-all-ballot-states" data-party="${escapeAttr(party.id)}" type="button">All</button>
              <button data-action="clear-ballot-states" data-party="${escapeAttr(party.id)}" type="button">Clear</button>
            </div>
          </div>
          <div class="ballot-state-grid">
            ${STATE_META.map(state => `
              <label title="${escapeAttr(state.name)}">
                <input type="checkbox" data-ballot-state="${escapeAttr(state.abbr)}" data-party="${escapeAttr(party.id)}" ${selected.has(state.abbr) ? 'checked' : ''} />
                <span>${escapeHtml(state.abbr)}</span>
              </label>
            `).join('')}
          </div>
        ` : '<p class="ballot-access-note">This party contests every state, district, and Senate class.</p>'}
      </section>
    `;
  }

  function partyDrawerSignature() {
    return JSON.stringify({
      blocs:app.blocs,
      parties:app.parties.map(party => ({
        id:party.id,
        party:party.party,
        short:party.short,
        candidate:party.candidate,
        color:party.color,
        image:mediaSignature(party.image),
        imageStatus:party.imageStatus,
        bloc:party.bloc,
        profile:party.profile,
        social:party.social,
        economic:party.economic,
        geography:party.geography,
        populism:party.populism,
        base:party.base,
        ballotAccess:party.ballotAccess,
        ballotStates:party.ballotStates,
        strongholds:party.strongholds,
      })),
    });
  }

  function mediaSignature(source) {
    const value = String(source || '');
    return `${value.length}:${value.slice(0, 40)}:${value.slice(-80)}`;
  }

  function openPartyDetails(list) {
    return new Set(
      [...(list?.querySelectorAll?.('.party-edit-card[data-party] details.party-dropdown[open]') || [])]
        .map(details => details.closest('.party-edit-card')?.dataset.party)
        .filter(Boolean)
    );
  }

  function renderBlocBuilder() {
    const list = document.getElementById('bloc-list');
    const status = document.getElementById('bloc-builder-status');
    if (status && !status.dataset.manual) status.textContent = 'Electoral blocs pool votes. Coalition-only blocs combine seats but keep separate candidates.';
    if (!list) return;
    list.innerHTML = app.blocs.length ? app.blocs.map(bloc => {
      const group = coalitionGroups().find(item => item.name === bloc.name) || { parties:[] };
      const totalBase = blocBaseTotal(bloc.name);
      const disabled = group.parties.length ? '' : 'disabled';
      return `
      <div class="bloc-chip ${bloc.mode === 'coalition' ? 'coalition-only' : 'electoral-bloc'}" style="--bloc:${escapeAttr(bloc.color)}">
        <i></i>
        <strong>${escapeHtml(bloc.name)}</strong>
        <label class="bloc-code-control" title="Three-letter bloc code">
          <span>Code</span>
          <input type="text" maxlength="3" value="${escapeAttr(bloc.short)}" data-bloc-short="${escapeAttr(bloc.name)}" aria-label="${escapeAttr(bloc.name)} bloc code" />
        </label>
        <span>${group.parties.length ? group.parties.map(party => escapeHtml(party.short)).join(' + ') : 'No parties assigned'}</span>
        <div class="bloc-mode-control" aria-label="${escapeAttr(bloc.name)} bloc type">
          <button class="${bloc.mode === 'electoral' ? 'active' : ''}" data-action="set-bloc-kind" data-bloc="${escapeAttr(bloc.name)}" data-bloc-kind="electoral" title="Pool member votes and run as one electoral ticket">Electoral</button>
          <button class="${bloc.mode === 'coalition' ? 'active' : ''}" data-action="set-bloc-kind" data-bloc="${escapeAttr(bloc.name)}" data-bloc-kind="coalition" title="Parties compete separately, but seats combine after the election">Coalition</button>
        </div>
        <label class="bloc-share-control ${group.parties.length ? '' : 'disabled'}" title="Alliance national vote">
          <b>Vote</b>
          <input type="number" min="0.1" max="${escapeAttr(blocShareMax(group.parties))}" step="0.1" value="${escapeAttr(totalBase.toFixed(1))}" data-bloc-share="${escapeAttr(bloc.name)}" ${disabled} />
          <em>%</em>
        </label>
        <button class="election-btn small" data-action="clear-bloc" data-bloc="${escapeAttr(bloc.name)}">Clear</button>
      </div>
    `;
    }).join('') : '<span class="drawer-empty">No blocs yet. Parties are called individually unless you create and assign a coalition.</span>';
  }

  function coalitionGroups() {
    const groups = new Map();
    app.parties.forEach(party => {
      if (!party.bloc) return;
      const bloc = findBloc(party.bloc);
      const group = groups.get(party.bloc) || {
        name:party.bloc,
        short:bloc?.short || shortCode(party.bloc),
        color:bloc?.color || party.color,
        mode:bloc?.mode || 'electoral',
        parties:[],
      };
      group.parties.push(party);
      groups.set(party.bloc, group);
    });
    return [...groups.values()];
  }

  function blocParties(name) {
    return app.parties.filter(party => party.bloc === name);
  }

  function blocBaseTotal(name) {
    return blocParties(name).reduce((sum, party) => sum + Math.max(0, Number(party.base) || 0), 0);
  }

  function blocShareMax(parties) {
    return 100;
  }

  function setBlocShare(name, value) {
    if (String(value ?? '').trim() === '') return false;
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return false;
    const members = blocParties(name);
    if (!members.length) return false;
    const currentTotal = members.reduce((sum, party) => sum + Math.max(0, Number(party.base) || 0), 0);
    const targetTotal = clamp(numericValue, 0.1, blocShareMax(members), currentTotal || members.length);
    if (currentTotal <= 0.01) {
      const evenShare = targetTotal / members.length;
      members.forEach(party => { party.base = clamp(evenShare, 0.1, 100, evenShare); });
      invalidateElectionResults();
      return true;
    }
    const ratio = targetTotal / currentTotal;
    members.forEach(party => {
      const nextBase = (Math.max(0, Number(party.base) || 0) * ratio);
      party.base = clamp(nextBase, 0.1, 100, nextBase);
    });
    invalidateElectionResults();
    return true;
  }

  function refreshPartyBaseControls(parties = app.parties) {
    parties.forEach(party => {
      const value = Number(party.base).toFixed(1);
      document.querySelectorAll(`[data-vote-share="${cssEscape(party.id)}"]`).forEach(input => {
        if (document.activeElement !== input) input.value = value;
      });
      document.querySelectorAll(`.party-edit-card[data-party="${cssEscape(party.id)}"] [data-slider="base"]`).forEach(input => {
        if (document.activeElement !== input) input.value = value;
        const output = input.closest('.editor-slider')?.querySelector('output');
        if (output) output.textContent = `${value}%`;
      });
    });
  }

  function refreshBlocShareControls(name = '') {
    const blocs = name ? [name] : app.blocs.map(bloc => bloc.name);
    blocs.forEach(blocName => {
      const value = blocBaseTotal(blocName).toFixed(1);
      document.querySelectorAll(`[data-bloc-share="${cssEscape(blocName)}"]`).forEach(input => {
        if (document.activeElement !== input) input.value = value;
      });
    });
  }

  function editorSlider(field, label, value, left, right, min = 0, max = 100, step = 1, suffix = '') {
    return `
      <label class="editor-slider">
        <span><b>${escapeHtml(label)}</b><output>${escapeHtml(Number(value).toFixed(suffix ? 1 : 0))}${escapeHtml(suffix)}</output></span>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${Number(value)}" data-slider="${field}" />
        <em>${escapeHtml(left)} · ${escapeHtml(right)}</em>
      </label>
    `;
  }

  function acknowledgeChoice(button) {
    const group = button?.closest?.('.government-choice-row, .government-role-buttons, .agenda-tabs, .delegation-mode-control, .chamber-view-toggle, .bloc-mode-control');
    group?.querySelectorAll('button.active').forEach(item => item.classList.remove('active'));
    button?.classList.add('active');
    acknowledgeAction(button);
  }

  function bindEvents(wrap) {
    if (wrap.dataset.bound) return;
    wrap.dataset.bound = '1';
    wrap.addEventListener('click', event => {
      const actionEl = event.target.closest('[data-action]');
      const statePick = event.target.closest('[data-state-pick]');
      const districtPick = event.target.closest('[data-district-pick]');
      if (statePick) {
        const previousMode = app.electionMode;
        const previousMapMode = app.mapMode;
        app.selectedState = statePick.dataset.statePick;
        app.selectedCounty = '';
        app.selectedElectoralUnit = '';
        app.selectedSenateClass = '';
        app.electionMode = statePick.dataset.modePick === 'senate' ? 'senate' : 'president';
        app.mapMode = 'states';
        app.editingRace = '';
        renderControls();
        refreshMapModeControls();
        if (previousMode === app.electionMode && previousMapMode === 'states') renderSelectedRace();
        else deferInteractiveRender(() => renderElectionReadouts({ includeMap:true, skipGovernment:true }), statePick);
        saveState();
        return;
      }
      if (districtPick) {
        const district = houseDistrictById.get(districtPick.dataset.districtPick);
        if (district) {
          const previousMode = app.electionMode;
          app.selectedDistrict = district.id;
          app.selectedState = district.state;
          app.selectedCounty = '';
          app.selectedElectoralUnit = '';
          app.selectedSenateClass = '';
          app.electionMode = 'house';
          app.editingRace = '';
          renderControls();
          refreshMapModeControls();
          if (previousMode === 'house') renderSelectedRace();
          else deferInteractiveRender(() => renderElectionReadouts({ includeMap:true, skipGovernment:true }), districtPick);
          saveState();
        }
        return;
      }
      if (!actionEl) return;
      event.preventDefault();
      const action = actionEl.dataset.action;
      if (action === 'map-zoom-in' || action === 'map-zoom-out' || action === 'map-zoom-reset') {
        if (action === 'map-zoom-in') zoomMapBy(MAP_BUTTON_ZOOM);
        if (action === 'map-zoom-out') zoomMapBy(1 / MAP_BUTTON_ZOOM);
        if (action === 'map-zoom-reset') resetMapCamera();
        return;
      }
      if (action === 'toggle-parties') {
        app.partiesOpen = !app.partiesOpen;
        const drawer = document.getElementById('party-drawer');
        drawer?.classList.toggle('open', app.partiesOpen);
        renderControls();
        if (app.partiesOpen) deferInteractiveRender(renderPartyDrawer, actionEl);
        else renderPartyDrawer();
        saveState();
        return;
      }
      if (action === 'toggle-government-panel') {
        app.government.open = !app.government.open;
        if (app.government.open) pendingGovernmentAnimation = { type:'panel' };
        const card = document.getElementById('government-card');
        if (card) card.hidden = !app.government.open;
        renderControls();
        deferInteractiveRender(() => {
          renderGovernmentAssembly(null, { reuseElectionSnapshot:true });
          renderControls();
        }, actionEl);
        saveState();
        return;
      }
      if (action === 'close-government-panel') {
        app.government.open = false;
        const card = document.getElementById('government-card');
        if (card) card.hidden = true;
        renderControls();
        deferInteractiveRender(() => renderGovernmentAssembly(null, { reuseElectionSnapshot:true }), actionEl);
        saveState();
        return;
      }
      if (action === 'mode-president' || action === 'mode-senate' || action === 'mode-house') {
        app.electionMode = action === 'mode-senate' ? 'senate' : action === 'mode-house' ? 'house' : 'president';
        app.selectedCounty = '';
        app.selectedElectoralUnit = '';
        app.selectedSenateClass = '';
        app.editingRace = '';
        if (app.electionMode === 'senate' && app.selectedState === 'DC') app.selectedState = 'MD';
        if (app.electionMode === 'house' && !houseDistrictById.has(app.selectedDistrict)) {
          app.selectedDistrict = houseDistricts[0]?.id || '';
        }
        renderControls();
        refreshMapModeControls();
        deferInteractiveRender(() => renderElectionReadouts({ includeMap:true, skipGovernment:true }), actionEl);
        saveState();
        return;
      }
      if (action === 'map-states' || action === 'back-states' || action === 'map-counties') {
        app.electionMode = 'president';
        app.mapMode = action === 'map-counties' ? 'counties' : 'states';
        app.selectedSenateClass = '';
        app.selectedElectoralUnit = '';
        app.editingRace = '';
        renderControls();
        refreshMapModeControls();
        deferInteractiveRender(() => renderElectionReadouts({ includeMap:true, skipGovernment:true }), actionEl);
        saveState();
        return;
      }
      if (action === 'set-chamber-view') {
        app.settings.chamberView = actionEl.dataset.chamberView === 'party' ? 'party' : 'bloc';
        acknowledgeChoice(actionEl);
        renderControls();
        deferInteractiveRender(() => {
          const result = calculateElection();
          renderCountLine(result);
          renderChamberGraph(result);
        }, actionEl);
        saveState();
        return;
      }
      if (action === 'toggle-bloc-mode') {
        app.settings.coalitionMode = !app.settings.coalitionMode;
        invalidateElectionResults();
        renderControls();
        deferInteractiveRender(() => renderElectionReadouts({ includeMap:true }), actionEl);
        saveState();
        return;
      }
      if (action === 'edit-senate-seat') {
        app.selectedSenateClass = String(actionEl.dataset.senateClass || '');
        app.selectedElectoralUnit = '';
        app.editingRace = `senate-seat:${app.selectedState}:${app.selectedSenateClass}`;
        renderSidebar(calculateElection());
        saveState();
        return;
      }
      if (action === 'edit-electoral-unit') {
        app.selectedElectoralUnit = String(actionEl.dataset.electoralUnit || '');
        app.selectedSenateClass = '';
        app.editingRace = `electoral-unit:${app.selectedElectoralUnit}`;
        renderSidebar(calculateElection());
        saveState();
        return;
      }
      if (action === 'back-race-parent') {
        app.selectedElectoralUnit = '';
        app.selectedSenateClass = '';
        app.editingRace = '';
        renderSidebar(calculateElection());
        saveState();
        return;
      }
      if (action === 'toggle-race-edit') {
        const key = `${actionEl.dataset.raceKind}:${actionEl.dataset.raceId}`;
        app.editingRace = app.editingRace === key ? '' : key;
        renderSidebar(calculateElection());
        saveState();
        return;
      }
      if (action === 'set-bloc-kind') {
        if (setBlocKind(actionEl.dataset.bloc, actionEl.dataset.blocKind)) {
          acknowledgeChoice(actionEl);
          renderBlocBuilder();
          deferInteractiveRender(() => renderElectionReadouts({ includeMap:true }), actionEl);
          saveState();
        }
        return;
      }
      if (action === 'set-map-view') {
        app.settings.mapView = actionEl.dataset.mapView === 'party' ? 'party' : 'bloc';
        acknowledgeChoice(actionEl);
        renderControls();
        deferInteractiveRender(() => renderMap(calculateElection()), actionEl);
        saveState();
        return;
      }
      if (action === 'set-ballot-mode') {
        const party = findParty(actionEl.dataset.party);
        if (party) {
          party.ballotAccess = actionEl.dataset.ballotMode === 'states' ? 'states' : 'nationwide';
          if (party.ballotAccess === 'states' && !party.ballotStates.length && stateByAbbr.has(app.selectedState)) {
            party.ballotStates = [app.selectedState];
          }
          commitBallotAccessChange(party, true, actionEl);
        }
        return;
      }
      if (action === 'select-all-ballot-states' || action === 'clear-ballot-states') {
        const party = findParty(actionEl.dataset.party);
        if (party) {
          party.ballotAccess = 'states';
          party.ballotStates = action === 'select-all-ballot-states' ? STATE_META.map(state => state.abbr) : [];
          commitBallotAccessChange(party, true, actionEl);
        }
        return;
      }
      if (['set-delegation-mode','select-delegation-state','set-delegation-vote'].includes(action)) {
        if (action === 'set-delegation-mode') setDelegationMode(actionEl.dataset.delegationMode);
        if (action === 'select-delegation-state') selectDelegationState(actionEl.dataset.state);
        if (action === 'set-delegation-vote') setDelegationVote(actionEl.dataset.state, actionEl.dataset.party);
        if (action !== 'select-delegation-state') acknowledgeChoice(actionEl);
        else acknowledgeAction(actionEl);
        deferInteractiveRender(() => renderGovernmentAssembly(null, { reuseElectionSnapshot:true }), actionEl);
        saveState();
        return;
      }
      if (['set-gov-president','set-gov-vice','set-gov-role','set-gov-agenda','clear-government','hold-gov-vote'].includes(action)) {
        if (action === 'set-gov-president') setGovernmentOffice('presidentId', actionEl.dataset.party);
        if (action === 'set-gov-vice') setGovernmentOffice('vicePresidentId', actionEl.dataset.party);
        if (action === 'set-gov-role') setGovernmentRole(actionEl.dataset.party, actionEl.dataset.govRole);
        if (action === 'set-gov-agenda') setGovernmentAgenda(actionEl.dataset.agenda);
        if (action === 'clear-government') clearGovernment();
        if (action === 'hold-gov-vote') holdGovernmentVote();
        if (!['clear-government','hold-gov-vote'].includes(action)) acknowledgeChoice(actionEl);
        else acknowledgeAction(actionEl);
        deferInteractiveRender(() => {
          renderGovernmentAssembly(null, { reuseElectionSnapshot:true });
          renderControls();
        }, actionEl);
        saveState();
        return;
      }
      if (action === 'reroll') {
        app.settings.seed = Math.round(Date.now() % 1000000);
        invalidateElectionResults();
        renderControls();
        deferInteractiveRender(() => renderElectionReadouts({ includeMap:true }), actionEl);
        saveState();
        return;
      }
      if (action === 'set-duration') {
        stopCount();
        app.settings.simDuration = Number(actionEl.dataset.duration) || 120;
        renderControls();
        saveState();
        return;
      }
      if (action === 'reset-count') {
        stopCount();
        app.settings.reporting = 0;
        invalidateElectionResults();
        renderControls();
        deferInteractiveRender(() => renderElectionReadouts({ includeMap:true }), actionEl);
        saveState();
        return;
      }
      if (action === 'next-batch') {
        if (!voteSetupValidation().valid) {
          renderControls();
          return;
        }
        stopCount();
        app.settings.reporting = clamp(app.settings.reporting + 8, 0, 100);
        invalidateElectionResults();
        renderControls();
        deferInteractiveRender(() => renderElectionReadouts({ includeMap:true }), actionEl);
        saveState();
        return;
      }
      if (action === 'play-count') {
        toggleCount();
        return;
      }
      if (action === 'reset-mode-edits') {
        if (!clearModeRaceEdits(app.electionMode)) return;
        app.editingRace = '';
        renderControls();
        acknowledgeAction(actionEl);
        deferInteractiveRender(() => renderElectionReadouts({ includeMap:true }), actionEl);
        saveState();
        return;
      }
      if (action === 'reset-race-edit') {
        clearRelatedRaceEdits(actionEl.dataset.raceKind, actionEl.dataset.raceId);
        app.editingRace = '';
        renderControls();
        deferInteractiveRender(() => renderElectionReadouts({ includeMap:true }), actionEl);
        saveState();
        return;
      }
      if (action === 'add-party') addParty();
      if (action === 'import-parliament') importParliamentParties();
      if (action === 'create-bloc') createBloc();
      if (action === 'clear-bloc') clearBloc(actionEl.dataset.bloc);
      if (action === 'remove-party') removeParty(actionEl.dataset.party);
      if (action === 'apply-preset') applyPreset(actionEl);
      if (action === 'add-boost') addBoost(actionEl);
      if (action === 'remove-boost') removeBoost(actionEl.dataset.party, actionEl.dataset.state);
      deferInteractiveRender(renderAll, actionEl);
      saveState();
    });
    wrap.addEventListener('input', event => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.blocShort !== undefined) {
        target.value = String(target.value || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3);
        return;
      }
      if (target.dataset.voteShare) {
        const party = findParty(target.dataset.voteShare);
        if (party) {
          party.base = clamp(target.value, 0.1, 100, party.base);
          invalidateElectionResults();
          if (party.bloc) refreshBlocShareControls(party.bloc);
          refreshBallotAccessSummary(party);
          stopCountForInvalidVoteSetup();
          scheduleElectionReadouts({ preserveCandidates:true, skipGovernment:true });
          queueMapRender();
          queueGovernmentRender();
          queueSaveState();
        }
        return;
      }
      if (target.dataset.blocShare) {
        const blocName = target.dataset.blocShare;
        if (setBlocShare(blocName, target.value)) {
          const members = blocParties(blocName);
          refreshPartyBaseControls(members);
          members.forEach(refreshBallotAccessSummary);
          stopCountForInvalidVoteSetup();
          scheduleElectionReadouts({ preserveCandidates:true, skipGovernment:true });
          queueMapRender();
          queueGovernmentRender();
          queueSaveState();
        }
        return;
      }
      if (target.dataset.governmentName !== undefined) {
        app.government.name = String(target.value || '').slice(0, 80);
        queueSaveState();
        return;
      }
      if (target.dataset.raceEditParty) {
        applyRaceEditSlider(target);
        return;
      }
      if (target.dataset.setting) {
        setSetting(target);
        deferInteractiveRender(renderAll, target);
        saveState();
        return;
      }
      const card = target.closest('[data-party]');
      if (!card) return;
      const party = findParty(card.dataset.party);
      if (!party) return;
      if (target.dataset.boostSlider) {
        const abbr = target.dataset.boostSlider;
        party.strongholds = normalizeStrongholds(party.strongholds || {});
        party.strongholds[abbr] = clamp(target.value, 1, 25, STRONGHOLD_BOOST);
        invalidateElectionResults();
        const output = target.closest('.boost-chip')?.querySelector('output');
        if (output) output.textContent = Math.round(party.strongholds[abbr]);
        scheduleElectionReadouts({ preserveCandidates:true, skipGovernment:true });
        queueMapRender();
        queueGovernmentRender();
        queueSaveState();
        return;
      }
      if (target.dataset.field) {
        setPartyField(party, target.dataset.field, target.value, card);
        if (isSoftPartyField(target.dataset.field)) {
          refreshPartyEditorCard(party, card);
          scheduleElectionReadouts({ preserveCandidates:true, skipGovernment:true });
          queueGovernmentRender();
        } else {
          deferInteractiveRender(renderAll, target);
        }
        queueSaveState();
        return;
      }
      if (target.dataset.slider) {
        const field = target.dataset.slider;
        party[field] = clamp(target.value, field === 'base' ? 0.1 : 0, 100);
        invalidateElectionResults();
        if (['social','economic','geography','populism'].includes(field)) {
          party.profile = '';
          const presetSelect = card.querySelector('[data-preset]');
          if (presetSelect) presetSelect.value = '';
        }
        const output = target.closest('.editor-slider')?.querySelector('output');
        if (output) output.textContent = field === 'base' ? Number(party[field]).toFixed(1) + '%' : Math.round(party[field]);
        if (field === 'base' && party.bloc) refreshBlocShareControls(party.bloc);
        if (field === 'base') {
          refreshBallotAccessSummary(party);
          stopCountForInvalidVoteSetup();
        }
        scheduleElectionReadouts({ preserveCandidates:true, skipGovernment:true });
        queueMapRender();
        queueGovernmentRender();
        queueSaveState();
        return;
      }
    });
    wrap.addEventListener('change', event => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.dataset.ballotState) {
        const party = findParty(target.dataset.party);
        if (party) {
          const selected = new Set(party.ballotStates || []);
          if (target.checked) selected.add(target.dataset.ballotState);
          else selected.delete(target.dataset.ballotState);
          party.ballotAccess = 'states';
          party.ballotStates = normalizeBallotStates([...selected]);
          commitBallotAccessChange(party, false, target);
        }
        return;
      }
      if (target instanceof HTMLInputElement && target.dataset.raceEditParty) {
        renderElectionReadouts({ preserveCandidates:true, includeMap:true });
        queueGovernmentRender();
        saveState();
        return;
      }
      if (target instanceof HTMLElement && target.dataset.blocShort !== undefined) {
        const bloc = findBloc(target.dataset.blocShort);
        if (bloc) {
          bloc.short = shortCode(target.value || bloc.name);
          invalidateElectionResults();
          target.value = bloc.short;
          renderElectionReadouts({ preserveCandidates:true });
          saveState();
        }
        return;
      }
      if (target instanceof HTMLElement && target.dataset.preset !== undefined) {
        applyPreset(target);
        deferInteractiveRender(renderAll, target);
        saveState();
        return;
      }
      if (target instanceof HTMLInputElement && target.dataset.imageUpload) {
        handleImageUpload(target);
        return;
      }
      if (target instanceof HTMLElement && target.dataset.field && target.dataset.field !== 'color') {
        const party = findParty(target.closest('[data-party]')?.dataset.party);
        if (party) {
          setPartyField(party, target.dataset.field, target.value, target.closest('[data-party]'));
          deferInteractiveRender(renderAll, target);
          saveState();
        }
      }
      if (target instanceof HTMLElement && target.dataset.field === 'color') {
        const party = findParty(target.closest('[data-party]')?.dataset.party);
        if (party) {
          party.color = target.value;
          invalidateElectionResults();
          deferInteractiveRender(renderAll, target);
          saveState();
        }
      }
    });
  }

  function setSetting(target) {
    const field = target.dataset.setting;
    if (field === 'reporting') stopCount();
    if (target.type === 'checkbox') app.settings[field] = target.checked;
    else app.settings[field] = Number(target.value);
    invalidateElectionResults();
  }

  function governmentUnlocked() {
    return app.settings.reporting >= 100;
  }

  function setGovernmentOffice(field, partyId) {
    if (!governmentUnlocked() || !['presidentId','vicePresidentId'].includes(field)) return;
    const party = findParty(partyId);
    if (!party) return;
    app.government[field] = party.id;
    pendingGovernmentAnimation = { type:'office', field, key:party.id };
    app.government.open = true;
    app.government = normalizeGovernment(app.government, app.parties);
  }

  function setGovernmentRole(partyId, role) {
    const party = findParty(partyId);
    if (!governmentUnlocked() || !party) return;
    const memberIds = governmentCoalitionMemberIds([party.id]);
    const roles = ['cabinetIds','supportIds','passiveIds'];
    roles.forEach(key => {
      app.government[key] = (app.government[key] || []).filter(id => !memberIds.includes(id));
    });
    if (role === 'cabinet') app.government.cabinetIds.push(...memberIds);
    else if (role === 'support') app.government.supportIds.push(...memberIds);
    else if (role === 'passive') app.government.passiveIds.push(...memberIds);
    pendingGovernmentAnimation = { type:'role', key:governmentRoleEntityKey(party), role };
    app.government = normalizeGovernment(app.government, app.parties);
  }

  function setGovernmentAgenda(key) {
    if (!governmentUnlocked()) return;
    if (GOVERNMENT_AGENDA.some(item => item.key === key)) {
      app.government.agenda = key;
      pendingGovernmentAnimation = { type:'agenda', key };
    }
  }

  function setDelegationMode(mode) {
    if (!governmentUnlocked()) return;
    app.government.delegationMode = mode === 'manual' ? 'manual' : 'auto';
    if (app.government.delegationMode === 'manual' && !app.government.selectedDelegationState) {
      app.government.selectedDelegationState = app.selectedState !== 'DC' ? app.selectedState : 'PA';
    }
    pendingGovernmentAnimation = { type:'delegation-mode', key:app.government.delegationMode };
  }

  function selectDelegationState(abbr) {
    if (!governmentUnlocked() || !stateByAbbr.has(abbr) || abbr === 'DC') return;
    app.government.selectedDelegationState = abbr;
    pendingGovernmentAnimation = { type:'delegation-select', key:abbr };
  }

  function setDelegationVote(abbr, partyId) {
    if (!governmentUnlocked() || app.government.delegationMode !== 'manual' || !stateByAbbr.has(abbr) || abbr === 'DC') return;
    app.government.delegationVotes = { ...(app.government.delegationVotes || {}) };
    if (partyId === 'default' || partyId === 'auto' || partyId === 'unassigned') delete app.government.delegationVotes[abbr];
    else if (partyId === 'deadlock' || findParty(partyId)) app.government.delegationVotes[abbr] = partyId;
    app.government.selectedDelegationState = abbr;
    pendingGovernmentAnimation = { type:'delegation-vote', key:abbr, partyId };
  }

  function clearGovernment() {
    if (!governmentUnlocked()) return;
    app.government.presidentId = '';
    app.government.vicePresidentId = '';
    app.government.cabinetIds = [];
    app.government.supportIds = [];
    app.government.passiveIds = [];
    app.government.delegationMode = 'auto';
    app.government.delegationVotes = {};
    app.government.selectedDelegationState = '';
    app.government.history = [];
    app.government.name = '';
    app.government.agenda = GOVERNMENT_AGENDA[0]?.key || 'budget';
    app.government.open = true;
    pendingGovernmentAnimation = { type:'clear' };
    app.government = normalizeGovernment(app.government, app.parties);
  }

  function holdGovernmentVote() {
    if (!governmentUnlocked()) return;
    const assembly = calculateGovernmentAssembly();
    const requiredVotes = assembly.votes.filter(vote => assembly.agenda.chambers.includes(vote.chamber));
    const passed = governmentVotePassed(requiredVotes);
    const detail = requiredVotes.map(vote => {
      const chamber = vote.chamber === 'house' ? 'House' : 'Senate';
      return `${chamber} ${vote.yes}${vote.vpCanBreakTie ? '+VP' : ''}-${vote.no}`;
    }).join(' · ');
    const voteId = `vote-${Date.now()}`;
    app.government.history = [
      {
        id:voteId,
        label:assembly.agenda.label,
        result:passed ? 'Passed' : 'Failed',
        detail,
        passed,
      },
      ...(app.government.history || []),
    ].slice(0, 6);
    pendingGovernmentAnimation = { type:'vote', key:voteId, passed };
  }

  function setPartyField(party, field, value, card) {
    if (field === 'short') party.short = shortCode(value);
    else party[field] = value.trim();
    if (['party','short','bloc'].includes(field)) invalidateElectionResults();
    if (field === 'candidate') {
      party.imageStatus = party.candidate.length > 2 ? 'Searching picture...' : 'Type candidate for picture';
      const status = card.querySelector('.image-status');
      if (status) status.textContent = party.imageStatus;
      queueImageFetch(party.id, party.candidate);
    }
  }

  function isSoftPartyField(field) {
    return field === 'candidate' || field === 'party' || field === 'short';
  }

  function renderElectionReadouts(options = {}) {
    if (options.includeMap) clearQueuedMapRender();
    if (!options.skipGovernment) clearQueuedGovernmentRender();
    const result = calculateElection();
    if (options.preserveCandidates) refreshCandidateCards(result);
    else renderCandidates(result);
    renderCountLine(result);
    renderChamberGraph(result);
    if (!options.skipGovernment) renderGovernmentAssembly(result);
    renderControls();
    if (options.includeMap) renderMap(result);
    renderSidebar(result);
    scheduleElectionCacheWarmup();
  }

  function refreshCandidateCards(result, displayRows = null) {
    const rows = displayRows || candidateDisplayRows(result);
    const leaderId = rows[0]?.displayId;
    rows.forEach(row => {
      const party = row.party;
      const assignedBloc = party.bloc ? findBloc(party.bloc) : null;
      const card = document.querySelector(`[data-candidate-card="${cssEscape(row.displayId)}"]`);
      if (!card) return;
      const cardColor = row.type === 'bloc'
        ? (row.color || party.color)
        : (assignedBloc?.color || party.color);
      setStyleVarIfChanged(card, '--party', party.color);
      setStyleVarIfChanged(card, '--bloc', row.color || assignedBloc?.color || party.color);
      setStyleVarIfChanged(card, '--card', cardColor);
      const photo = card.querySelector('.candidate-photo');
      if (photo) {
        setClassIfChanged(photo, 'has-image', !!party.image);
        const imageSource = party.image || '';
        if (candidatePhotoSources.get(photo) !== imageSource) {
          photo.style.backgroundImage = imageSource ? `url("${String(imageSource).replace(/"/g, '%22')}")` : '';
          candidatePhotoSources.set(photo, imageSource);
        }
        const initialsEl = photo.querySelector('span');
        setTextIfChanged(initialsEl, initials(party.candidate || party.party));
      }
      const partnerRow = card.querySelector('.candidate-partner-row');
      if (partnerRow) {
        const partnerKey = candidatePartnerKey(row.partners);
        if (candidatePartnerKeys.get(partnerRow) !== partnerKey) {
          partnerRow.innerHTML = row.partners.slice(0, 5).map(partner => partyPortrait(partner.party, 'candidate-partner-photo')).join('');
          candidatePartnerKeys.set(partnerRow, partnerKey);
        }
      }
      setClassIfChanged(card, 'winner', candidateHasWon(row, leaderId, result.majority));
      const shortEl = card.querySelector('.candidate-short');
      setTextIfChanged(shortEl, party.short);
      const blocTag = card.querySelector('.candidate-bloc-tag');
      setTextIfChanged(blocTag, row.blocName || assignedBloc?.name || '');
      const nameEl = card.querySelector('.candidate-info strong');
      setTextIfChanged(nameEl, party.candidate || 'Unnamed candidate');
      const nameLine = card.querySelector('.candidate-name-line');
      if (nameLine) {
        const existing = nameLine.querySelector('.winner-check');
        const won = candidateHasWon(row, leaderId, result.majority);
        if (won && !existing) nameLine.insertAdjacentHTML('beforeend', winnerCheckMarkup(cardColor, claimWinnerBadgeAnimation(row)));
        if (won && existing) setStyleVarIfChanged(existing, '--party', cardColor);
        if (!won && existing) existing.remove();
      }
      const partyEl = card.querySelector('.candidate-info em');
      setTextIfChanged(partyEl, party.party);
      const evEl = card.querySelector('[data-candidate-ev]');
      setTextIfChanged(evEl, `${row.ev}${row.vpTieBreak ? '+VP' : ''}`);
      const scoreLabel = card.querySelector('[data-score-label]');
      setTextIfChanged(scoreLabel, result.unitLabel || 'points');
      const voteInput = card.querySelector('[data-vote-share]');
      if (voteInput) {
        if (document.activeElement !== voteInput) voteInput.value = Number(party.base).toFixed(1);
        const voteLabel = voteInput.closest('.candidate-vote-input');
        const voteLabelText = voteLabel?.querySelector('span');
        setTextIfChanged(voteLabelText, party.ballotAccess === 'states' ? 'Area vote' : 'Vote');
        if (voteLabel) voteLabel.title = party.ballotAccess === 'states' ? 'Share within selected states' : 'Nationwide vote share';
      }
      const voteTotal = card.querySelector('.candidate-vote-total');
      setTextIfChanged(voteTotal, `${row.blocName} vote ${pct(row.popularPct)}`);
      const votesEl = card.querySelector('[data-candidate-votes]');
      setTextIfChanged(votesEl, compactVotes(row.popularVotes));
    });
  }

  function refreshPartyEditorCard(party, card = null) {
    const editorCard = card || partyEditorCard(party.id);
    if (!editorCard) return;
    const photo = editorCard.querySelector('.edit-photo');
    if (photo) {
      setClassIfChanged(photo, 'has-image', !!party.image);
      const imageSource = party.image || '';
      if (editorPhotoSources.get(photo) !== imageSource) {
        photo.style.backgroundImage = imageSource ? `url("${String(imageSource).replace(/"/g, '%22')}")` : '';
        editorPhotoSources.set(photo, imageSource);
      }
      const initialsEl = photo.querySelector('span');
      setTextIfChanged(initialsEl, initials(party.candidate || party.party));
    }
    const status = editorCard.querySelector('.image-status');
    setTextIfChanged(status, party.imageStatus || (party.image ? 'Picture ready' : 'Type candidate for picture'));
    const upload = editorCard.querySelector('.image-upload');
    if (upload) {
      setClassIfChanged(upload, 'visible', imageNeedsUpload(party) || !!party.image);
      const label = upload.querySelector('span');
      setTextIfChanged(label, party.image ? 'Replace photo' : 'Upload photo');
    }
  }

  function partyEditorCard(partyId) {
    return [...document.querySelectorAll('.party-edit-card[data-party]')].find(card => card.dataset.party === partyId) || null;
  }

  function editorHasFocus() {
    return !!document.activeElement?.closest?.('#party-editor-list');
  }

  function candidateStripHasFocus() {
    return !!document.activeElement?.closest?.('#candidate-strip');
  }

  function electionViewActive() {
    try {
      return viewMode === 'uselection'
        && !document.hidden
        && document.getElementById('us-election-wrap')?.classList.contains('visible');
    } catch (e) {
      return false;
    }
  }

  function addParty() {
    const party = normalizeParty({
      id:`party-${Date.now()}`,
      party:'New Party',
      short:'NEW',
      candidate:'',
      color:fallbackColor(app.parties.length),
      bloc:'',
      base:2,
    }, app.parties.length);
    app.parties.push(party);
    invalidateElectionResults();
    app.partiesOpen = true;
    stopCountForInvalidVoteSetup();
  }

  function importParliamentParties() {
    const source = parliamentParties();
    const status = document.getElementById('bloc-builder-status');
    if (!source.length) {
      if (status) {
        status.textContent = 'No parliament parties found to import.';
        status.dataset.manual = '1';
      }
      return;
    }
    const usable = source
      .map((party, index) => ({ ...party, _index:index, _seats:Math.max(0, Number(party.seats) || 0), _pollPct:Number(party.pollPct) }))
      .filter(party => String(party.name || '').trim() && (party._seats > 0 || Number.isFinite(party._pollPct)));
    if (!usable.length) {
      if (status) {
        status.textContent = 'Parliament parties need seats or poll percentages to import.';
        status.dataset.manual = '1';
      }
      return;
    }
    const pollTotal = usable.reduce((sum, party) => sum + (Number.isFinite(party._pollPct) ? Math.max(0, party._pollPct) : 0), 0);
    const seatTotal = usable.reduce((sum, party) => sum + party._seats, 0) || 1;
    const importStamp = Date.now();
    app.parties = usable.map((party, index) => {
      const sliders = electionSlidersFromParliamentParty(party);
      const rawBase = Number.isFinite(party._pollPct) && pollTotal > 0
        ? Math.max(0.1, party._pollPct / pollTotal * 100)
        : Math.max(0.1, party._seats / seatTotal * 100);
      return normalizeParty({
        id:`import-${importStamp}-${index}`,
        party:String(party.name || `Party ${index + 1}`).trim(),
        short:shortCode(party.name || `P${index + 1}`),
        candidate:'',
        color:party.color || fallbackColor(index),
        bloc:'',
        base:rawBase,
        strongholds:{},
        ...sliders,
      }, index);
    });
    imageTimers.forEach(timer => clearTimeout(timer));
    imageTimers.clear();
    imageBooted = true;
    app.partiesOpen = true;
    app.government = normalizeGovernment({ open:true }, app.parties);
    app.settings.reporting = 0;
    invalidateElectionResults();
    stopCount();
    if (status) {
      status.textContent = `Imported ${app.parties.length} parliament parties.`;
      status.dataset.manual = '1';
    }
  }

  function parliamentParties() {
    try {
      if (Array.isArray(parties) && parties.length) return parties;
    } catch (e) {}
    try {
      const saved = JSON.parse(localStorage.getItem('parliament_autosave') || 'null');
      if (Array.isArray(saved?.parties) && saved.parties.length) return saved.parties;
    } catch (e) {}
    return [];
  }

  function electionSlidersFromParliamentParty(party) {
    const key = String(party.ideology || '').toLowerCase();
    const presets = {
      left: { profile:'progressive', social:86, economic:74, geography:78, populism:55 },
      green: { profile:'green-politics', social:84, economic:79, geography:76, populism:48 },
      'center-left': { profile:'social-dem', social:72, economic:66, geography:70, populism:42 },
      center: { profile:'center', social:50, economic:50, geography:55, populism:38 },
      'center-right': { profile:'center-right', social:37, economic:38, geography:44, populism:42 },
      right: { profile:'conservative', social:26, economic:32, geography:36, populism:58 },
      regional: { profile:'regional', social:50, economic:50, geography:50, populism:62 },
    };
    if (presets[key]) return presets[key];
    const name = String(party.name || '').toLowerCase();
    if (/(green|ecolog|environment)/.test(name)) return presets.green;
    if (/(left|social|labou?r|workers?|commun|progress)/.test(name)) return presets.left;
    if (/(liberal democrat|democrat|centre|center|forward)/.test(name)) return presets.center;
    if (/(conserv|republic|right|national|freedom|patriot)/.test(name)) return presets.right;
    return presets.center;
  }

  function removeParty(id) {
    if (app.parties.length <= 1) return;
    app.parties = app.parties.filter(party => party.id !== id);
    invalidateElectionResults();
    app.government = normalizeGovernment(app.government, app.parties);
    stopCountForInvalidVoteSetup();
  }

  function findParty(id) {
    return app.parties.find(party => party.id === id);
  }

  function applyPreset(control) {
    const card = control.closest('.party-edit-card');
    const party = findParty(card?.dataset.party || control.dataset.party);
    const select = control.dataset.preset !== undefined ? control : card?.querySelector('[data-preset]');
    const preset = PROFILE_PRESETS.find(item => item.key === select?.value);
    if (!party) return;
    if (!preset) {
      party.profile = '';
      forcedOpenPartyId = party.id;
      invalidateElectionResults();
      return;
    }
    party.profile = preset.key;
    party.social = preset.social;
    party.economic = preset.economic;
    party.geography = preset.geography;
    party.populism = preset.populism;
    forcedOpenPartyId = party.id;
    invalidateElectionResults();
  }

  function addBoost(button) {
    const card = button.closest('.party-edit-card');
    const partyId = button.dataset.party || card?.dataset.party;
    const party = findParty(partyId);
    const abbr = button.closest('.boost-add')?.querySelector('[data-new-boost-state]')?.value
      || card?.querySelector('[data-new-boost-state]')?.value;
    if (party && stateByAbbr.has(abbr)) {
      party.strongholds = normalizeStrongholds(party.strongholds || {});
      party.strongholds[abbr] = STRONGHOLD_BOOST;
      forcedOpenPartyId = party.id;
      invalidateElectionResults();
    }
  }

  function removeBoost(partyId, abbr) {
    const party = findParty(partyId);
    if (party && Object.prototype.hasOwnProperty.call(party.strongholds, abbr)) {
      delete party.strongholds[abbr];
      forcedOpenPartyId = party.id;
      invalidateElectionResults();
    }
  }

  function createBloc() {
    const input = document.getElementById('new-bloc-name');
    const shortInput = document.getElementById('new-bloc-short');
    const modeInput = document.getElementById('new-bloc-mode');
    const colorInput = document.getElementById('new-bloc-color');
    const status = document.getElementById('bloc-builder-status');
    const name = input?.value.trim();
    if (!name) {
      if (status) {
        status.textContent = 'Name the bloc first.';
        status.dataset.manual = '1';
      }
      input?.focus();
      return;
    }
    if (findBloc(name)) {
      if (status) {
        status.textContent = `${name} already exists.`;
        status.dataset.manual = '1';
      }
      return;
    }
    const color = /^#[0-9a-f]{6}$/i.test(String(colorInput?.value || '')) ? colorInput.value : fallbackColor(app.blocs.length + 4);
    const short = shortCode(shortInput?.value || name);
    const mode = modeInput?.value === 'electoral' ? 'electoral' : 'coalition';
    app.blocs.push({ name, short, color, mode });
    invalidateElectionResults();
    if (input) input.value = '';
    if (shortInput) shortInput.value = '';
    if (modeInput) modeInput.value = 'coalition';
    if (colorInput) colorInput.value = fallbackColor(app.blocs.length + 4);
    if (status) {
      status.textContent = `${name} (${short}) created as ${mode === 'electoral' ? 'an electoral bloc' : 'a coalition-only bloc'}. Assign parties from their bloc dropdowns.`;
      status.dataset.manual = '1';
    }
    if (mode === 'electoral') app.settings.coalitionMode = true;
  }

  function setBlocKind(name, mode) {
    const bloc = findBloc(name);
    if (!bloc) return false;
    const nextMode = mode === 'electoral' ? 'electoral' : 'coalition';
    if (bloc.mode !== nextMode) {
      bloc.mode = nextMode;
      invalidateElectionResults();
    }
    return true;
  }

  function clearBloc(name) {
    if (!name || !findBloc(name)) return;
    app.parties.forEach(party => {
      if (party.bloc === name) party.bloc = '';
    });
    app.blocs = app.blocs.filter(bloc => bloc.name !== name);
    invalidateElectionResults();
  }

  function stopCountForInvalidVoteSetup() {
    if (countTimer && !voteSetupValidation().valid) stopCount();
  }

  function refreshBallotAccessSummary(party) {
    const config = document.querySelector(`[data-ballot-config="${cssEscape(party.id)}"]`);
    const summary = config?.querySelector('[data-ballot-summary]');
    const count = (party.ballotStates || []).length;
    const access = party.ballotAccess === 'states'
      ? `${count} state${count === 1 ? '' : 's'}`
      : 'Nationwide';
    setTextIfChanged(summary, `${access} · ${partyEffectiveNationalBase(party).toFixed(1)} effective national points`);
  }

  function commitBallotAccessChange(party, redrawDrawer, button = null) {
    invalidateElectionResults();
    stopCountForInvalidVoteSetup();
    if (redrawDrawer) forcedOpenPartyId = party.id;
    else refreshBallotAccessSummary(party);
    renderControls();
    deferInteractiveRender(() => {
      if (redrawDrawer) renderPartyDrawer();
      renderElectionReadouts({ preserveCandidates:true, includeMap:true, skipGovernment:true });
    }, button);
    queueGovernmentRender();
    queueSaveState();
  }

  function stopCount() {
    if (countTimer) {
      clearInterval(countTimer);
      countTimer = null;
    }
  }

  function toggleCount() {
    if (countTimer) {
      stopCount();
      renderControls();
      return;
    }
    if (!voteSetupValidation().valid) {
      renderControls();
      return;
    }
    const step = 100 / Math.max(30, Number(app.settings.simDuration) || 120);
    countTimer = setInterval(() => {
      app.settings.reporting = clamp(app.settings.reporting + step, 0, 100);
      invalidateElectionResults();
      if (app.settings.reporting >= 100) stopCount();
      renderElectionReadouts({ includeMap:true });
      saveState();
    }, 1000);
    renderControls();
  }

  function queueImageFetch(partyId, name, boot = false) {
    if (imageTimers.has(partyId)) clearTimeout(imageTimers.get(partyId));
    const clean = String(name || '').trim();
    if (clean.length < 3) return;
    imageTimers.set(partyId, setTimeout(() => fetchCandidateImage(partyId, clean), boot ? 200 + Math.round(hashNumber(partyId) * 800) : 650));
  }

  function imageNeedsUpload(party) {
    return /no picture|unavailable|upload/i.test(String(party?.imageStatus || '')) && !party?.image;
  }

  async function handleImageUpload(input) {
    const party = findParty(input.dataset.imageUpload);
    const file = input.files?.[0];
    input.value = '';
    if (!party || !file) return;
    if (!/^image\//i.test(file.type || '')) {
      party.imageStatus = 'Choose an image file.';
      refreshPartyEditorCard(party);
      saveState();
      return;
    }
    party.imageStatus = 'Preparing uploaded photo...';
    refreshPartyEditorCard(party);
    try {
      party.image = await imageFileToCompactDataUrl(file);
      party.imageRemote = '';
      party.imageStatus = 'Uploaded picture ready';
      refreshPartyEditorCard(party);
      renderElectionReadouts({ preserveCandidates:true });
      saveState();
    } catch (e) {
      party.imageStatus = 'Upload failed. Try another image.';
      refreshPartyEditorCard(party);
      saveState();
    }
  }

  function imageFileToCompactDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('read failed'));
      reader.onload = () => {
        const dataUrl = String(reader.result || '');
        if (!dataUrl) {
          reject(new Error('empty image'));
          return;
        }
        compactImageDataUrl(dataUrl).then(resolve, () => resolve(dataUrl));
      };
      reader.readAsDataURL(file);
    });
  }

  function isRemoteImageSource(source) {
    return /^https?:\/\//i.test(String(source || ''));
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('image read failed'));
      reader.onload = () => {
        const dataUrl = String(reader.result || '');
        if (dataUrl) resolve(dataUrl);
        else reject(new Error('empty image'));
      };
      reader.readAsDataURL(blob);
    });
  }

  async function remoteImageToCompactDataUrl(source) {
    const response = await fetch(source, { mode:'cors', cache:'force-cache' });
    if (!response.ok) throw new Error(`image request failed: ${response.status}`);
    const blob = await response.blob();
    if (!/^image\//i.test(blob.type || '')) throw new Error('invalid image response');
    const dataUrl = await blobToDataUrl(blob);
    return compactImageDataUrl(dataUrl).catch(() => dataUrl);
  }

  function compactImageDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const maxSize = 520;
        const scale = Math.min(1, maxSize / Math.max(img.width || maxSize, img.height || maxSize));
        const width = Math.max(1, Math.round((img.width || maxSize) * scale));
        const height = Math.max(1, Math.round((img.height || maxSize) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('canvas unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.src = dataUrl;
    });
  }

  async function fetchCandidateImage(partyId, name) {
    const party = findParty(partyId);
    if (!party || party.candidate.trim() !== name) return;
    imageTimers.delete(partyId);
    try {
      const title = name.replace(/\s+/g, '_');
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
      if (res.ok) {
        const data = await res.json();
        const src = data?.thumbnail?.source || data?.originalimage?.source;
        if (src) {
          if (!findParty(partyId) || party.candidate.trim() !== name) return;
          party.imageRemote = src;
          try {
            const storedImage = await remoteImageToCompactDataUrl(src);
            if (!findParty(partyId) || party.candidate.trim() !== name) return;
            party.image = storedImage;
            party.imageStatus = 'Picture saved locally';
          } catch (e) {
            if (!findParty(partyId) || party.candidate.trim() !== name) return;
            party.image = src;
            party.imageStatus = 'Picture ready online';
          }
        } else {
          party.imageStatus = 'No picture found. Upload one.';
        }
      } else {
        party.imageStatus = 'Picture unavailable. Upload one.';
      }
    } catch (e) {
      party.imageStatus = 'Picture unavailable. Upload one.';
    }
    if (!electionViewActive()) {
      electionViewRendered = false;
    } else if (editorHasFocus()) {
      refreshPartyEditorCard(party);
      renderElectionReadouts();
    } else if (candidateStripHasFocus()) {
      renderElectionReadouts({ preserveCandidates:true });
    } else {
      refreshPartyEditorCard(party);
      renderElectionReadouts({ preserveCandidates:true, skipGovernment:true });
    }
    saveState();
  }

  function bootLeaderImages() {
    if (imageBooted) return;
    imageBooted = true;
    app.parties.forEach((party, index) => {
      if (!party.image && party.candidate) queueImageFetch(party.id, party.candidate, true);
      else if (isRemoteImageSource(party.image)) {
        const partyId = party.id;
        const candidate = party.candidate;
        const source = party.image;
        const timer = setTimeout(async () => {
          imageTimers.delete(partyId);
          try {
            const storedImage = await remoteImageToCompactDataUrl(source);
            const current = findParty(partyId);
            if (!current || current.candidate !== candidate || current.image !== source) return;
            current.image = storedImage;
            current.imageRemote = source;
            current.imageStatus = 'Picture saved locally';
            refreshPartyEditorCard(current);
            renderElectionReadouts({ preserveCandidates:true, skipGovernment:true });
            saveState();
          } catch (e) {
            const current = findParty(partyId);
            if (current && current.image === source) current.imageStatus = 'Picture ready online';
          }
        }, 250 + index * 180);
        imageTimers.set(partyId, timer);
      }
    });
  }

  function ensureTooltip() {
    if (tooltip) return;
    tooltip = document.createElement('div');
    tooltip.className = 'election-tooltip';
    document.body.appendChild(tooltip);
  }

  function showTip(event) {
    if (mapGesture?.dragged) return;
    ensureTooltip();
    tooltip.innerHTML = event.currentTarget.dataset.tip || '';
    tooltip.classList.add('visible');
    moveTip(event);
  }

  function moveTip(event) {
    if (!tooltip || mapGesture?.dragged) return;
    const pad = 14;
    const width = tooltip.offsetWidth || 280;
    const height = tooltip.offsetHeight || 170;
    let x = event.clientX + 16;
    let y = event.clientY + 16;
    if (x + width + pad > window.innerWidth) x = event.clientX - width - 16;
    if (y + height + pad > window.innerHeight) y = event.clientY - height - 16;
    tooltip.style.left = `${Math.max(pad, x)}px`;
    tooltip.style.top = `${Math.max(pad, y)}px`;
  }

  function hideTip() {
    tooltip?.classList.remove('visible');
  }

  function showView() {
    buildShell();
    try {
      if (typeof stopElectionNightAuto === 'function') stopElectionNightAuto(false);
    } catch (e) {}
    try { viewMode = 'uselection'; } catch (e) {}
    document.body.classList.remove('election-night-open');
    document.body.classList.add('us-election-open');
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('view-uselection')?.classList.add('active');
    ['donut-wrap','bar-wrap','coalition-wrap','analysis-wrap'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = 'none';
      el.classList.remove('visible');
    });
    [
      '.mode-strip', '#quorum-warning', '.stats', '#verdict', '.persist-wrap', '#coalition-summary',
      '.party-table-head', '#party-list', '#log-vote-btn', '#reset-btn', '.history-wrap', '#legend-wrap',
    ].forEach(selector => {
      const el = document.querySelector(selector);
      if (el) el.style.display = 'none';
    });
    document.getElementById('us-election-wrap')?.classList.add('visible');
    if (electionViewRendered) renderControls();
    else deferInteractiveRender(renderAll, document.getElementById('view-uselection'));
  }

  function installHooks() {
    prepareMapData();
    buildShell();
    const button = document.getElementById('view-uselection');
    if (button && !button.dataset.usBound) {
      button.dataset.usBound = '1';
      button.addEventListener('click', () => setView('uselection'));
    }
    if (typeof setView === 'function' && !setView.__usElectionSimpleWrapped) {
      const original = setView;
      const wrapped = function(mode) {
        if (mode === 'uselection') {
          showView();
          return;
        }
        stopCount();
        hideTip();
        document.body.classList.remove('us-election-open');
        document.getElementById('us-election-wrap')?.classList.remove('visible');
        document.getElementById('view-uselection')?.classList.remove('active');
        ['donut-wrap','bar-wrap','coalition-wrap','analysis-wrap'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = '';
        });
        return original(mode);
      };
      wrapped.__usElectionSimpleWrapped = true;
      setView = wrapped;
    }
    if (typeof redrawAll === 'function' && !redrawAll.__usElectionSimpleWrapped) {
      const originalRedraw = redrawAll;
      const wrappedRedraw = function() {
        try {
          if (viewMode === 'uselection') {
            deferInteractiveRender(renderAll);
            return;
          }
        } catch (e) {}
        return originalRedraw();
      };
      wrappedRedraw.__usElectionSimpleWrapped = true;
      redrawAll = wrappedRedraw;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCount();
      try {
        if (typeof stopElectionNightAuto === 'function') stopElectionNightAuto(false);
      } catch (e) {}
      saveState();
      return;
    }
    try {
      if (viewMode === 'uselection') renderControls();
    } catch (e) {}
  });

  installHooks();
})();
