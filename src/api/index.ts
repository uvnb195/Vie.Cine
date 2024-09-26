const services = [
    {
        id: 'Combo 1',
        title: 'CGV COMBO 1',
        desc: `01 Baby Shark 2024 Cup (includes soft drink)\n- Add 29,000 VND to get a large sweet popcorn\n- Character cup design may vary at certain cinemas\n- Pick up on the day of your movie (when purchased with a ticket) or on the selected day (when purchased at the CGV Store)`,
        cost: 100,
        imageUri: 'https://iguov8nhvyobj.vcdn.cloud/media/concession/web/651711ff95995_1696010752.png',
        remaining: 10,
    },
    {
        id: 'Combo 2',
        title: 'CGV COMBO 2',
        desc: `1 Large Popcorn + 2 Jumbo Drinks. Redeem on showing date.
* Free upgrade flavor for Caramel *
**Surcharge when upgrade Cheese popcorn**`,
        cost: 200,
        imageUri: 'https://iguov8nhvyobj.vcdn.cloud/media/concession/web/6465deb2716d7_1684397746.png',
        remaining: 10,
    },
    {
        id: 'Combo 3',
        title: 'CGV COMBO 3',
        desc: `01 Baby Shark 2024 Cup (includes soft drink)
        - Add 29,000 VND to get a large sweet popcorn 
        - Character cup design may vary at certain cinemas
        - Pick up on the day of your movie (when purchased with a ticket) or on the selected day (when purchased at the CGV Store)`,
        cost: 100,
        imageUri: 'https://www.cgv.vn/media/wysiwyg/2021/Combo/Combo_BabyShark_2024_01.jpg',
        remaining: 10,
    },
    {
        id: 'Combo 4',
        title: 'CGV COMBO 4',
        desc: `1 Large Popcorn + 2 Jumbo Drinks. Redeem on showing date.
* Free upgrade flavor for Caramel *
**Surcharge when upgrade Cheese popcorn**`,
        cost: 200,
        imageUri: 'https://iguov8nhvyobj.vcdn.cloud/media/concession/web/6465deb2716d7_1684397746.png',
        remaining: 10,
    },
]

export const getService = (id: string) => {
    return services.find(service => service.id === id)
}