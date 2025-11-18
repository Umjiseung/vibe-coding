(function () {
  const fromGlobal = window.__API_BASE__ || window.__ENV?.API_BASE_URL;
  const metaTag = document.querySelector('meta[name="api-base"]');
  const fromMeta = metaTag?.getAttribute('content');

  const inferOrigin = () => {
    const { protocol, hostname, port } = window.location;
    const safeHost = hostname && hostname !== 'null' ? hostname : '127.0.0.1';
    const sameOrigin = !port || port === '80' || port === '443' || port === '5000';
    if (sameOrigin && window.location.origin && window.location.origin !== 'null') {
      return `${window.location.origin.replace(/\/$/, '')}/api`;
    }
    const inferredPort = '5000';
    return `${protocol || 'http:'}//${safeHost}:${inferredPort}/api`;
  };

  const normalize = (value) => {
    if (!value) return inferOrigin();
    return value.replace(/\/$/, '');
  };

  window.appConfig = Object.freeze({
    apiBase: normalize(fromGlobal || fromMeta)
  });
})();
