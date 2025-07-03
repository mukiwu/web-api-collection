export function getAnonymousId() {
  let id = localStorage.getItem('anonymous_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('anonymous_id', id);
  }
  return id;
}
