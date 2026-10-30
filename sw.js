/*
 * no-op 서비스워커.
 *
 * 이 사이트는 서비스워커를 사용하지 않는다. 이 파일은 단지:
 *  1) 정적 파일로 서빙되어 /sw.js 요청이 [region] 동적 라우트로 새지 않게 하고(에러 방지),
 *  2) 과거 다른 프로젝트가 같은 호스트(localhost 등)에 등록해 둔 잔존 SW를 스스로 해제·정리한다.
 */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (e) {
        /* noop */
      }
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url));
    })()
  );
});
