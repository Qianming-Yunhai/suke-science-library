const gradeButtons = document.querySelectorAll(".grade-switch button");
const subjectCards = document.querySelectorAll(".subject-card");
const teacherSearch = document.querySelector("#teacherSearch");
const searchResult = document.querySelector("#searchResult");
const linkList = document.querySelector("#linkList");
const resourceLinks = window.resourceLinks || [];

function showGrade(grade) {
  subjectCards.forEach((card) => {
    const grades = card.dataset.grade.split(" ");
    const shouldShow = grade === "all" || grades.includes(grade);
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

gradeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    gradeButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    showGrade(button.dataset.grade);
  });
});

if (teacherSearch && searchResult) {
  teacherSearch.addEventListener("click", () => {
    const grade = document.querySelector("#teacherGrade").value;
    const subject = document.querySelector("#teacherSubject").value;
    const type = document.querySelector("#teacherType").value;
    const keyword = document.querySelector("#teacherKeyword").value.trim();
    const keywordText = keyword ? `，关键词：${keyword}` : "";
    const matches = resourceLinks.filter((item) => {
      const typeMatched = type === "全部资料" || item.type === type;
      const keywordSource = `${item.title} ${item.grade} ${item.subject} ${item.chapter} ${item.type} ${item.note}`;
      return (
        item.grade === grade &&
        item.subject === subject &&
        typeMatched &&
        keywordSource.includes(keyword)
      );
    });

    searchResult.textContent = `正在查找：${grade} · ${subject} · ${type}${keywordText}。找到 ${matches.length} 条示例资料；填入真实网盘链接后即可打开。`;
    renderLinks(matches.length ? matches : resourceLinks);
  });
}

function renderLinks(items) {
  if (!linkList) return;

  linkList.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "link-card";

    const meta = document.createElement("span");
    meta.className = "link-meta";
    meta.textContent = `${item.grade} · ${item.subject} · ${item.type}`;

    const title = document.createElement("h3");
    title.textContent = item.title;

    const note = document.createElement("p");
    note.textContent = item.note;

    const footer = document.createElement("div");
    footer.className = "link-footer";

    const audience = document.createElement("span");
    audience.textContent = item.audience;

    if (item.url) {
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = item.code ? `打开链接 · 提取码 ${item.code}` : "打开链接";
      footer.append(audience, link);
    } else {
      const empty = document.createElement("span");
      empty.className = "link-button is-disabled";
      empty.textContent = "待填写链接";
      footer.append(audience, empty);
    }

    card.append(meta, title, note, footer);
    linkList.append(card);
  });
}

renderLinks(resourceLinks);
