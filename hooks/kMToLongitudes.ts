
function degreesToRadians(angle: number) {
    return angle * (Math.PI / 180);
}

export function kMToLongitudes(km: number, atLatitude: number) {
    return km * 0.0089831 / Math.cos(degreesToRadians(atLatitude));
}