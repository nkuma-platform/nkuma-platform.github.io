/* nkuma サポートサイト共通スクリプト
 * 1) コマンド枠 (pre) に「コピー」ボタンを付ける (#485)
 * 2) スクリーンショット差し込み枠 (figure.shot) — 画像が未配置の間は枠ごと非表示にする
 *    (images/shots/ に決められたファイル名で置くと自動で現れる)
 * 3) 外部サイトへのリンクは別タブで開く (#607)
 * 4) sticky ヘッダとページ内目次バーの実高を --header-h / --toc-h に入れる (狭幅で折り返して高くなっても、目次バーとアンカーが裏に隠れないように) */
(function () {
  var header = document.querySelector(".site-header"), toc = document.querySelector("nav.toc");
  if (!header) return;
  function measure() {
    var root = document.documentElement.style;
    root.setProperty("--header-h", header.offsetHeight + "px");
    if (toc) root.setProperty("--toc-h", toc.offsetHeight + "px");
  }
  measure();
  if (window.ResizeObserver) { var ro = new ResizeObserver(measure); ro.observe(header); if (toc) ro.observe(toc); } else window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
})();

document.querySelectorAll("pre").forEach(function (pre) {
  var wrap = document.createElement("div");
  wrap.className = "pre-wrap";
  pre.parentNode.insertBefore(wrap, pre);
  wrap.appendChild(pre);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-btn";
  btn.textContent = "コピー";
  btn.addEventListener("click", function () {
    var code = pre.querySelector("code");
    var text = (code ? code.innerText : pre.innerText).trim();
    navigator.clipboard.writeText(text).then(
      function () { flash("コピーしました"); },
      function () { flash("コピーできませんでした"); }
    );
    function flash(label) {
      btn.textContent = label;
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = "コピー";
        btn.classList.remove("copied");
      }, 1600);
    }
  });
  wrap.appendChild(btn);
});

document.querySelectorAll("figure.shot img").forEach(function (img) {
  function hide() {
    var fig = img.closest("figure.shot");
    if (fig) fig.style.display = "none";
  }
  if (img.complete && img.naturalWidth === 0) {
    hide();
  } else {
    img.addEventListener("error", hide);
  }
});

/* 外部サイトへのリンクだけ別タブで開く。読んでいる手順のページを見失わせないため。
 * ページ内アンカー (#...) とサイト内リンク (./guide.html 等) は同じタブのまま。
 * 個別に target を書くとページを増やすたび取り残しが出るので、ここで一括して付ける */
document.querySelectorAll("a[href]").forEach(function (a) {
  if (!/^https?:\/\//i.test(a.getAttribute("href"))) return;  // 相対リンク・#・mailto は対象外
  if (a.host === location.host) return;                       // 自サイトの絶対 URL も対象外
  a.target = "_blank";
  a.rel = "noopener";
});
