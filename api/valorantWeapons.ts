export default async function getWeapon(){
    const response = await fetch('https://valorant-api.com/v1/weapons');
    return await response.json();
}