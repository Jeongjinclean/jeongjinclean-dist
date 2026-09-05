/* 정진클린 홈 — 전후 비교(Before/After) 탭 + 드래그 슬라이더.
   랜딩 BeforeAfter 와 동일 방식: AFTER(청소 후) 실사진을 베이스로 BEFORE(청소 전)를
   pos% 만큼 클립하고, BEFORE 내부 이미지 폭을 10000/pos% 로 보정해 한 자리에 고정한다.
   탭 전환 시 슬라이더는 50% 로 리셋. */
(function () {
  "use strict";
  var DATA = [
    { label: "아파트 유리창", before: "assets/ba/ba-before.webp", after: "assets/ba/ba-after.webp" },
    { label: "외벽 청소", before: "assets/ba/ba-exterior-before.webp", after: "assets/ba/ba-exterior-after.webp" },
    { label: "관공서·기업", before: "assets/ba/ba-gov-after.webp", after: "assets/ba/ba-gov-before.webp" },
    { label: "간판 청소", before: "assets/ba/ba-sign-before.webp", after: "assets/ba/ba-sign-after.webp" },
    { label: "어닝 청소", before: "assets/ba/ba-awning-before.webp", after: "assets/ba/ba-awning-after.webp" },
    { label: "시트지 제거", before: "assets/ba/ba-film-before.webp", after: "assets/ba/ba-film-after.webp" },
  ];
  var tabs = document.getElementById("jj-ba-tabs");
  var stage = document.getElementById("jj-ba-stage");
  if (!tabs || !stage) return;

  var SWAP_SVG =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M7 8l-4 4 4 4"/><path d="M17 8l4 4-4 4"/><path d="M3 12h18"/></svg>';

  function esc(s) { return String(s).replace(/"/g, "&quot;"); }

  function render(i) {
    var btns = tabs.querySelectorAll("button");
    for (var k = 0; k < btns.length; k++) btns[k].classList.toggle("active", k === i);
    var d = DATA[i];
    stage.innerHTML =
      '<div class="jj-ba-slider">' +
      '<img class="jj-ba-after" loading="lazy" src="' + esc(d.after) + '" alt="' + esc(d.label) + ' 시공 후">' +
      '<span class="jj-ba-tag after">AFTER · 청소 후</span>' +
      '<div class="jj-ba-before" style="width:50%">' +
      '<img loading="lazy" src="' + esc(d.before) + '" style="width:200%" alt="' + esc(d.label) + ' 시공 전">' +
      '<span class="jj-ba-tag before">BEFORE · 청소 전</span>' +
      '</div>' +
      '<div class="jj-ba-divider" style="left:50%"></div>' +
      '<div class="jj-ba-handle" style="left:50%">' + SWAP_SVG + "</div>" +
      '<input type="range" class="jj-ba-range" min="0" max="100" value="50" aria-label="전후 비교 슬라이더">' +
      "</div>";

    var box = stage.querySelector(".jj-ba-before");
    var img = box.querySelector("img");
    var divider = stage.querySelector(".jj-ba-divider");
    var handle = stage.querySelector(".jj-ba-handle");
    stage.querySelector(".jj-ba-range").addEventListener("input", function (e) {
      var pos = Math.max(Number(e.target.value), 0.001);
      box.style.width = pos + "%";
      img.style.width = (10000 / pos) + "%";
      divider.style.left = pos + "%";
      handle.style.left = pos + "%";
    });
  }

  DATA.forEach(function (d, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = d.label;
    b.addEventListener("click", function () { render(i); });
    tabs.appendChild(b);
  });
  render(0);
})();
