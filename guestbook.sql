-- 방명록 표(guestbook)를 만든다.
-- 글 하나 = 표 한 줄. 칸은 별명(nickname), 한마디(message), 작성 시각(created_at).
create table guestbook (
  id bigint generated always as identity primary key,
  nickname text not null check (char_length(nickname) between 1 and 20),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

comment on column guestbook.nickname is '별명';
comment on column guestbook.message is '한마디';
comment on column guestbook.created_at is '작성 시각';

-- 규칙(권한)을 켠다. 규칙이 켜지면 아래에서 허락한 일만 할 수 있다.
alter table guestbook enable row level security;
create policy "누구나 읽기" on guestbook for select using (true);
create policy "누구나 쓰기" on guestbook for insert with check (true);
-- 고치기·지우기 정책은 없다 → 공개 키로는 아무도 고치거나 지울 수 없다
