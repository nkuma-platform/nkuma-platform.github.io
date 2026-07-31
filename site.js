/* nkuma サポートサイト共通スクリプト
 * コマンド枠 (pre) に「コピー」ボタンを付ける (#485) */
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
