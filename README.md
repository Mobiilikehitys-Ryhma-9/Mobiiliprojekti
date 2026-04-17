# 🗺️ Kartta-sovellus

Sovellus on tarkoitettu edistämään esteetööntä liikkumista kaupunkiympäristössä. Karttanäkymässä esitetään reittivaihtoehtoja kävelevälle tai pyörätuolilla liikkuvalle käyttäjälle. Rekisteröidyt käyttäjät pystyvät ilmoittamaan mahdollisia esteettömyyteen liittyviä huomioita, jotka huomioidaan reittivaihtoehdoissa. Sovellus on toteutettu React Nativella ja reittivaihtoehtojen hakemiseen sovellus käyttää [OpenRouteService](https://openrouteservice.org/) rajapintaa. Käyttäjien tehdyt ilmoitukset tallentuvat Googlen Firebase Firestoreen ja niihin liitetyt kuvat tallentuvat [Cloudinaryyn](https://cloudinary.com/)

## Sisältö
- [Toiminnot](#toiminnot)
- [Käyttöönotto](#käyttöönotto)
- [Technical information](#technical-information)
- [Muu](#muu)


## Toiminnot

### :star: Hae reitti kartalta
Käyttäjä voi kirjautumatta sovellukseen hakea eri reittivaihtoehtoja. Käyttäjä voi valita reitiksi joko kävelyä tai pyörätuolia suosivan reitin. Jos kartta havaitsee esteen tiellä, se etsii vaihtoehtoisen reitin. Pyörätuolilla kulkevan reittivalinassa kartta ottaa huomioon eri maanpinnan korkeuden muutokset. 


### :star: Luo käyttäjä ja kirjaudu sisään
Sovelluksen käyttäjä voi luoda sovellukseen tilin ja kirjautua sillä sisään. Käyttäjän luomiseen tarvitaan sähköpostiosoite ja salasana. Käyttäjä voi vaihtaa salasanan profiilisivulta. Unohtuneen salasanan voi myös luoda uudelleen sähköpostin kautta.


### :star: Luo pin-ilmoitus mahdollisista esteistä 
Kirjautunut käyttäjä voi luoda pin-ilmoituksen näkemästään mahdollisesta esteestä ulkona ollessaan. Käyttäjä voi kirjoittaa esteelle kuvauksen, ottaa kuvan sekä laittaa havaittu este kategoriaan, joka määrittelee sen kuinka kauan ilmoitus on näkyvillä kartassa.


### :star: Selaa luotuja pin-ilmoituksia
Eri käyttäjien luomat pin-ilmoitukset ovat näkyvillä kaikille sovelluksen käyttäjille kartassa. Painamalla kartassa olevaa piniä, käyttäjä näkee ilmoituksen kuvauksen ja mahdollisen kuvan. Ilmoituksia voi selata myös omalta sivulta, jossa ne esiintyvät listassa.


## Käyttöönotto
Tarvitset sovelluksen testaamiseen älypuhelimen ja siihen Expo Go sovelluksen. Lataa tiedosto gitHubista esimerkiksi Visual Studio Codeen ja aja terminaalissa npx expo start (huomioi, että puhelimen ja tietokoneen tulee olla yhdistettynä samaan nettiin). Expo Go:lla voit lukea qr-koodin, joka avaa sovelluksen puhelimella.


## Technical information
Sovellus on tehty React Nativella, jossa on käytetty TypeScriptiä. Sovelluksessa hyödynnetään: 
- [OpenRouteService](https://openrouteservice.org/)
- [Google Firebase Firestore](https://firebase.google.com/)
- [Cloudinary](https://cloudinary.com/)

## Poster?


## Muu

Ryhmän työtunti kirjaukset löytyvät täältä: [Työaikataulu](https://unioulu.sharepoint.com/:x:/r/sites/Mobiilikehitys-Ryhm9/_layouts/15/Doc.aspx?sourcedoc=%7B309F4982-980D-4279-B633-1D7A4FECF6A8%7D&file=Ty%C3%B6ajan%20seuranta.xlsx&action=default&mobileredirect=true)

