/*
 * 정진클린 홈 — 시공사례(works) 게시판 피드.
 * 관리자(admin.jeongjinclean.kr)에서 발행한 published 글을 불러와 홈 그리드에 렌더.
 * 데이터가 없거나 API 미가동이면 안내 문구만 표시(홈은 절대 깨지지 않음).
 */
(function () {
  "use strict";
  var grid = document.getElementById("jj-works-grid");
  if (!grid) return;

  var endpoint = grid.getAttribute("data-endpoint") || "";
  var LIMIT = 8;

  var SERVICE_KO = {
    "window": "유리창청소",
    "exterior-wall": "외벽청소",
    "sign-cleaning": "간판청소",
    "awning-cleaning": "어닝청소",
    "film-removal": "시트지제거",
  };
  var REGION_KO = { seoul: "서울", incheon: "인천", gyeonggi: "경기" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function empty(msg) {
    grid.classList.add("is-empty");
    grid.innerHTML = '<div class="jj-works-empty">' + esc(msg) + "</div>";
  }

  function cardHtml(w) {
    var thumb = w.cover_image || (w.images && w.images[0] && w.images[0].path) || "";
    var href = "/works/" + encodeURIComponent(w.region_slug) + "/" + encodeURIComponent(w.slug) + "/";
    var region = REGION_KO[w.region_group] || "";
    var service = SERVICE_KO[w.service] || "";
    var badges = "";
    if (region) badges += "<span>" + esc(region) + "</span>";
    if (service) badges += "<span>" + esc(service) + "</span>";
    var thumbStyle = thumb ? ' style="background-image:url(' + esc(thumb) + ')"' : "";
    return (
      '<a class="jj-work-card" href="' + esc(href) + '">' +
      '<div class="jj-work-thumb"' + thumbStyle + "></div>" +
      '<div class="jj-work-body"><div class="jj-work-badges">' + badges + "</div>" +
      "<h3>" + esc(w.title) + "</h3></div></a>"
    );
  }

  if (!endpoint) { empty("시공사례를 준비하고 있습니다."); return; }

  var done = false;
  var timer = setTimeout(function () {
    if (!done) empty("시공사례를 준비하고 있습니다.");
  }, 6000);

  fetch(endpoint, { credentials: "omit" })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (res) {
      done = true;
      clearTimeout(timer);
      var works = (res && res.data && res.data.works) || [];
      works = works.filter(function (w) { return w && w.status === "published"; }).slice(0, LIMIT);
      if (!works.length) { empty("시공사례를 준비하고 있습니다."); return; }
      grid.classList.remove("is-empty");
      grid.innerHTML = works.map(cardHtml).join("");
    })
    .catch(function () {
      done = true;
      clearTimeout(timer);
      empty("시공사례를 준비하고 있습니다.");
    });
})();
