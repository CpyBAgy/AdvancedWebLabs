ymaps.ready(init);

function init() {
    // Создаем карту
    const myMap = new ymaps.Map("map", {
        center: [59.939095, 30.315868], // Координаты центра карты (Санкт-Петербург)
        zoom: 12, // Уровень масштабирования
        controls: ["zoomControl", "fullscreenControl"], // Контролы карты
    });

    // Добавляем метки
    const locations = [
        {
            coords: [59.94515526757583,30.363618175482628], // Координаты Фурштатская 50
            hint: "Фурштатская 50",
            balloon: "<strong>Фурштатская 50</strong><br>пн-пт 10:00–22:00<br>сб-вс 10:00–21:00",
        },
        {
            coords: [59.9346760709287,30.309771806490588], // Координаты Малая Морская 19
            hint: "Малая Морская 19",
            balloon: "<strong>Малая Морская 19</strong><br>пн-пт 09:00–21:00<br>сб-вс 09:00–20:00",
        },
    ];

    // Создаем метки
    locations.forEach((location) => {
        const placemark = new ymaps.Placemark(
            location.coords,
            {
                hintContent: location.hint, //при наведении
                balloonContent: location.balloon, // при нажатии
            },
            {
                preset: "islands#icon",
                iconColor: "#593f0b", // Цвет метки
            }
        );
        myMap.geoObjects.add(placemark); // Добавляем метку на карту
    });

    // Настройка карты для отображения всех меток
    myMap.setBounds(myMap.geoObjects.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 20,
    });
}