function extractPathnameSegments(path) {
  const splitUrl = path.split('/');
  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

function constructRouteFromSegments(pathSegments) {
  if (pathSegments.resource && pathSegments.id) {
    return `/${pathSegments.resource}/:id`;
  }
  if (pathSegments.resource) {
    return `/${pathSegments.resource}`;
  }
  return '/';
}


export function getActivePathname() {
  return location.hash.replace('#', '') || '/';
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}