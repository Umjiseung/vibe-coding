(function () {
  const fromGlobal = window.__API_BASE__ || window.__ENV?.API_BASE_URL;
  const metaTag = document.querySelector('meta[name="api-base"]');
  const fromMeta = metaTag?.getAttribute('content');

  const inferOrigin = () => {
    if (window.location.origin && window.location.origin !== 'null') {
      return `${window.location.origin.replace(/\/$/, '')}/api`;
    }
    return 'http://127.0.0.1:5000/api';
  };

  const normalize = (value) => {
    if (!value) return inferOrigin();
    return value.replace(/\/$/, '');
  };

  window.appConfig = Object.freeze({
    apiBase: normalize(fromGlobal || fromMeta)
  });
})();
