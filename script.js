// Supabase 주소와 공개 키. 공개 키만 넣는다. 비밀 키(secret·service_role)는 넣지 않는다.
const SUPABASE_URL = "https://ipwxkrcogbyfealgimej.supabase.co";
const SUPABASE_KEY = "sb_publishable_6D7h8u4b6KN8vlW8h4HNWQ_VqHTmMqD";
const TABLE_URL = SUPABASE_URL + "/rest/v1/guestbook";

const nicknameInput = document.querySelector('input[name="nickname"]');
const messageInput = document.querySelector('input[name="message"]');
const list = document.querySelector("#guestbook-list");
const saveButton = list.closest("section").querySelector("button");

// 요청마다 같이 보내는 정보 (공개 키로 보낸다)
function requestHeaders(extra) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json",
    ...extra,
  };
}

// 표에서 글을 최신순(작성 시각이 나중인 것이 위)으로 가져와 목록에 그린다
async function loadList() {
  const res = await fetch(TABLE_URL + "?select=*&order=created_at.desc", {
    headers: requestHeaders(),
  });
  if (!res.ok) {
    throw new Error("목록을 불러오지 못했습니다. 상태 코드: " + res.status);
  }
  const rows = await res.json();

  list.textContent = "";
  for (const row of rows) {
    const item = document.createElement("li");

    const name = document.createElement("strong");
    name.textContent = row.nickname;

    const message = document.createElement("p");
    message.textContent = row.message;

    const time = document.createElement("small");
    time.textContent = new Date(row.created_at).toLocaleString("ko-KR");

    item.append(name, message, time);
    list.append(item);
  }
}

// 남기기 버튼을 눌렀을 때: 표에 한 줄 넣고 목록을 다시 그린다
async function saveEntry() {
  const nickname = nicknameInput.value.trim();
  const message = messageInput.value.trim();

  if (nickname === "" || message === "") {
    alert("별명과 한마디를 모두 적어 주세요.");
    return;
  }
  if (nickname.length > 20 || message.length > 500) {
    alert("별명은 20글자, 한마디는 500글자까지 쓸 수 있어요.");
    return;
  }

  saveButton.disabled = true;
  try {
    const res = await fetch(TABLE_URL, {
      method: "POST",
      headers: requestHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify({ nickname, message }),
    });
    if (!res.ok) {
      throw new Error("글을 저장하지 못했습니다. 상태 코드: " + res.status);
    }

    nicknameInput.value = "";
    messageInput.value = "";
    await loadList();
  } catch (error) {
    alert("남기지 못했어요. 잠시 뒤 다시 해 주세요.");
    console.error(error);
  } finally {
    saveButton.disabled = false;
  }
}

saveButton.addEventListener("click", saveEntry);

loadList().catch((error) => {
  console.error(error);
});
