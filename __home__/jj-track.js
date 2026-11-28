/* 방문·연락 버튼 자체 집계(처리방침 9항, 2026-12-02 시행) — 랜딩·홈·시공 사례가 함께 쓴다.
   쿠키를 쓰지 않는다. 창을 닫으면 지워지는 sessionStorage 에 '방문했음'(jj_v)과 들어온 주소(jj_r)만 둔다.
   서버(/admin_app/api/hit.php)는 들어온 주소를 '네이버 검색' 같은 종류로만 남기고, IP 는 저장하지 않는다.
   ⚠️ 시행일 전에는 아무것도 보내거나 저장하지 않는다(서버도 같은 날짜를 확인한다). */
(function () {
  if (Date.now() < Date.parse("2026-12-02T00:00:00+09:00") || navigator.webdriver) return;
  var URL_ = "/admin_app/api/hit.php";
  function send(ev, extra) {
    var b = new URLSearchParams();
    b.set("ev", ev);
    b.set("p", location.pathname);
    for (var k in extra || {}) if (extra[k] !== null) b.set(k, extra[k]);
    try {
      if (!(navigator.sendBeacon && navigator.sendBeacon(URL_, b))) fetch(URL_, { method: "POST", body: b, keepalive: true }).catch(function () {});
    } catch (e) { /* 집계 실패는 화면에 영향 없음 */ }
  }
  function get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  var first = false;
  try {
    first = !sessionStorage.getItem("jj_v");
    sessionStorage.setItem("jj_v", "1");
    if (first) sessionStorage.setItem("jj_r", document.referrer);
  } catch (e) { first = false; /* 저장소가 막힌 기기는 방문을 세지 않는다 */ }
  if (first) send("visit", { r: document.referrer });
  send("view");
  function spot(el) {
    for (var n = el; n && n !== document.body; n = n.parentElement) if (getComputedStyle(n).position === "fixed") return "bar";
    if (el.closest("footer")) return "foot";
    if (el.closest("header,.utilbar-inner,.headbar-inner")) return "head";
    return "body";
  }
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var h = a.getAttribute("href") || "";
    var ev = /^tel:/i.test(h) ? "tel" : /^sms:/i.test(h) ? "sms" : "";
    if (ev) send(ev, { s: spot(a), r: get("jj_r") });
  }, true);
})();
