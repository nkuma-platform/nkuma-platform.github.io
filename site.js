/* nkuma サポートサイト共通スクリプト
 * 1) コマンド枠 (pre) に「コピー」ボタンを付ける (#485)
 * 2) スクリーンショット差し込み枠 (figure.shot) — 画像が未配置の間は枠ごと非表示にする
 *    (images/shots/ に決められたファイル名で置くと自動で現れる) */
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
