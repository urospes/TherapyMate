const mongoose =require('mongoose');
const Terapeut=require('./models/terapeut');
const Terapija=require('./models/terapija');
const TipTerapije=require('./models/tipTerapije');
const Termin =require('./models/termin');
const Test=require('./models/test');
const Savetovaliste=require('./models/savetovaliste');

mongoose.connect("mongodb+srv://miljanasimic:MqA3HKtEKJvm6zIM@therapymate.fiavd.mongodb.net/therapyMate?retryWrites=true&w=majority", {useNewUrlParser: true,
 useUnifiedTopology: true,
 useCreateIndex:true})
.then(()=>{
  console.log("Uspostavljena konekcija sa bazom");
})
.catch(er=>{
  console.log("Doslo je do greske...");
  console.log(er);
})

const podaciTerapeut = async()=>{
  await Terapeut.deleteMany({});
  const teraputi=[
    {
      ime: 'Marko',
      prezime: 'Marković',
      email: 'marko.markovic@hotmail.com',
      telefon: '0631112233',
      specijalizacija: 'Geštalt psihoterapeut',
      opis: 'Sarađuje na mnogim projektima, radi u edukaciji ili nastavi sa decom i mladima različitog uzrasta, saradnik je više pedagoško-obrazovnih institucija, drži javna predavanja o značaju psihoterapije i mentalnog zdravlja, vodi psihološke radionice i grupe za lični rast i razvoj. U slobodno vreme piše članke, priče i eseje, bavi se fotografijom, filmom, član je više sportskih i planinarskih udruženja.',
      odobren: true
    },
    {
      ime: 'Petra',
      prezime: 'Ristić',
      email: 'petraristic@gmail.com',
      telefon: '0639682247',
      specijalizacija: 'Klinički psihoterapeut',
      opis: 'Psihoterapijom se bavim od 2014. godine. Privatna praksa i rad u Psihološkom savetovalištu za studente naučili su me kako da podržim klijente s različitim zahtevima i teškoćama poput gubitka, traume, anksioznosti, fobija, problema sa učenjem, pitanjima identiteta, niskog samopoštovanja, problemima u uspostavljanju odnosa, zaglavljenosti, depresivnosti, poremećaja ličnosti. Zahvaljujući iskustvu kliničkog psihologa na Klinici za zaštitu mentalnog zdravlja unapredila sam dijagnostičke veštine i kapacitete za hitno reagovanje i prevazilaženje akutnih emocionalnih problema.',
      odobren: true
    },
    {
      ime: 'Jovan',
      prezime: 'Petrović',
      email: 'petrovicjovann@gmail.com',
      telefon: '0636658123',
      specijalizacija: 'Klinički psihoterapeut',
      opis: 'Član sam međunarodnog udruženja za Transakcionu analizu (ITAA) od 2010 godine, međunarodne asocijacije za Relacionu transakcionu analizu (IARTA) i udruženja za transakcionu analizu Srbije (UTAS). Osnovao sam Udruženje za Transakcionu analizu Srbije (UTAS), u okviru kojeg organizujemo edukaciju iz Transakcione analize u oblasti psihoterapije.',
      odobren: true
    },
    {
      ime: 'Sanja',
      prezime: 'Ilić',
      email: 'ilic_sanja@yahoo.com',
      telefon: '0637744117',
      specijalizacija: 'Psihoterapeut u edukaciji O.L.I. metoda, integrativnog psihodinamskog pristupa.',
      opis: 'Studije psihologije sam završila 2017. godine na Odseku za psihologiju na Filozofskom fakultetu Univerziteta u Novom Sadu. Master studije sam upisala 2018. godine, takođe na Odseku za psihologiju na istom fakultetu u Novom Sadu.Zbog velike ljubavi prema psihologiji i psihoterapiji, upisala sam O.L.I. psihoterapijsku edukaciju, psihodinamskog integrativnog pristupa, što je ujedno i moj osnovni sistem rada. Edukacija je u organizaciji Centra za integrativnu psihodinamsku psihoterapiju, savetovanje i koučing. Moj trenutni edukacijski nivo je psihološki savetnik u edukaciji, a moj rad je pod supervizijom.',
      odobren: true
    }
  ];
  Terapeut.insertMany(teraputi)
  .then(res=>{
    console.log(res);
  })
  .catch(err=>{
    console.log(err);
  })
}

const podaciTipoviTerapija= async()=>{
  await TipTerapije.deleteMany({});
  const tipovi=[
    {
      naziv: 'Psihodinamička terapija',
      opis: 'Ova vrsta terapije je dosta povezana sa psihoanalizom. Fokus je na tome da pacijent otvoreno razgovara o svojim osećanjima, ali i o snovima i fantazijama. Takođe je značajno utvrditi kako su prošla iskustva, naročito u detinjstvu, uticala na obrasce ponašanja u sadašnjosti, kao i na stvaranje različitih negativnih odbrambenih mehanizama.\nPsihodinamička terapija se bavi i odnosima pacijenta sa drugim ljudima, gde terapeut pokušava da ukaže na različite probleme u komunikaciji i potrebe koje pacijent pokušava da zadovolji u tom odnosu. Kroz veću svest o korenima nekih mentalnih obrazaca i veza između prošlih događaja i sadašnjosti, pacijentu je lakše da promeni ponašanje i usvoji zdravije načine razmišljanja.'
    },
    {
      naziv:'Kognitivno-bihejvioralna terapija',
      opis: 'Ovaj tip terapije se bazira na premisi da promena misli i načina razmišljanja može da utiče i na promenu ponašanja.\n Negativne misli, poput sumnje u sopstvenu vrednosti ili prevelika samokritika, često ograničavaju i sputavaju ljude u poslovnim naporima ili emotivnim odnosima. Ove negativne misli često nemaju nikakav osnov u realnosti, a kognitivno-bihejvioralni pristup upravo ima jasan cilj da promeni način na koji unutrašnji monolog pacijenta funkcioniše. Iracionalna uverenja se kroz proces terapije polako zamenjuju pozitivnim i konstruktivnim, što dovodi do toga se pacijent oseća bolje u situacijama koje su ranije izazivale anksioznost ili neugodnost. Ovaj pristup često uključuje dosta praktičnih vežbi, pacijent aktivno učestvuje u psihoterapiji, a čitav program seansi najčešće ima specifične ciljeve i ograničeno trajanje.'
    },
    {
      naziv:'Geštalt terapija',
      opis: 'Оva vrsta terapije posmatra pacijenta u celosti i  pridaje pažnju ne samo onome što je rečeno, već i gestikulaciji i drugim ponašanjima. Umesto interpretacije prošlih iskustava kroz pokušaj dolaženja do nekih odgovora i generalizovanje, fokus je na tome da pacijent osvesti kako se oseća u sadašnjem trenutku, kao i da kroz oživljavanje prošlih situacija iznova oseti emocije koje su tada bile prisutne. Ovo se postiže kroz igranje uloga ili dramsko predstavljanje prošlih situacija, kao i kroz česta pitanja psihoterapeuta koja se odnose na trenutna osećanja pacijenta.\nUmesto pukog razgovora o emocijama, pacijent ih ponovo proživljava na seansi, a cilj je da vremenom pacijent preuzme odgovornost za svoje ponašanje i počne da bude više svestan svojih osećanja. Za razliku od psihodinamičke ili kognitivno-bihejvioralne terapije, terapeut ovde ne tumači emocije pacijenta, već mu pomaže da ih sam postane svestan.'
    },
    {
      naziv: 'Interpersonalna terapija',
      opis: 'Kao što se može zaključiti prema njenom nazivu, ova vrsta terapije se fokusira na međuljudske odnose, najčešće kod osoba koje pate od depresije. Ovaj pristup  uključuje nekoliko elemenata, od kojih je prvi identifikacija emocija, gde terapeut pokušava da uvidi stanje međuljudskih odnosa i na taj način osvesti emocije koje su prisutne. Zatim se radi na ispoljavanju emocija i poboljšanju problematičnih odnosa.\nInterpersonalna terapija je strukturirana, vremenski ograničena, a pacijent često ima „domaći“, kako bi se rad nastavio i van seansi. Ova vrsta terapije se često povezuje i sa grupnom terapijom, pošto na taj način pacijent može da vežba svoje komunikativne sposobnosti i veštine koje je stekao na individualnoj terapiji.'
    },
    {
      naziv: 'Grupna terapija',
      opis: 'Iako ideja o deljenju intimnih detalja sa nekoliko stranaca može delovati strašno, grupna terapija ima nekoliko jedinstvenih prednosti koje ne postoje u individualnom radu.\nKroz grupnu terapiju moguće je dobiti različitu perspektivu od drugih učesnika, koji su se suočili sa sličnim problemima ili samo imaju jedinstven uvid. Takođe, pacijent razvija osećaj da nije usamljen u svojim nedoumicama i strahovima, jer se grupna terapija temelji upravo na deljenju iskustava i problema. Terapeut usmerava teme razgovora i pomaže kreiranju grupne dinamike, a kroz odnose koji se stvore na grupnoj terapiji učesnici mogu da izvlače poruke i o drugim emotivnim odnosima u njihovom životu.'
    },
    {
      naziv: 'Transakciona analiza',
      opis: 'Rad u transakcionoj analizi se bazira na analiziranju strukture ličnosti klijenta, njegovih obrazaca komunikacije sa drugima, njegove lične istorije i naravno njegovog doživljaja svega toga. Jako je bitno da u TA klijent i terapeut idu ka postizanju jedne specifične terapijske promene. Što znači da je relativno jednostavno proceniti da li je terapija bila uspešna ili ne, i u kojoj meri. Često se desi da jedna promena vodi ka drugoj, nekad spontano a nekad kroz nastavak terapije, te da kvalitet života klijenta nastavlja da se poboljšava i po završetku terapije. TA je ugovorni terapijski model u kome klijent i terapeut preuzimaju svoj deo odgovornosti za tok terapijskog procesa. Ona podrazumeva aktivno učestvovanje klijenta u izboru ishoda terapije, ali i puta kojim se do tog cilja dolazi. Klijent je uključen tokom celog procesa, i njegova volja i angažovanje su, uz stručnost terapeuta, najbitniji kriterijumi za uspeh. Zato je transakciona analiza dobrovoljna terapija i podrazumeva da klijent dolazi motivisan da promeni nešto kod sebe, u svojim odnosima ili svom životu. U oblastima praktične primene, TA kao psihoterapeutski pravac može da se koristi u lečenju svih tipova psiholoških poremećaja, od svakodnevnih životnih problema do teških psihoza.\nTransakciona analiza se primenjuje u radu sa pojedincem, parom ili grupom.'
    },
    {
      naziv: 'Porodična terapija',
      opis:'Porodična psihoterapija je savremeni terapijski model koji obuhvata rad sa pojedincem, partnerima i porodicom. Sistemska porodična psihoterapija porodicu posmatra kao celinu. Promena kod jednog člana porodice utiče na ostale članove, a samim tim dolazi do promene u celom porodičnom sistemu. Porodična terapija ne smatra da je pojedinac problem ili da je problem u pojedincu, već u odnosima, relacijma i interakcijama koje ostvaruje u porodici.\nCiljevi porodične terpije su promene u sistemu porodičnog funkcionisanja.'
    }
  ];
  TipTerapije.insertMany(tipovi)
  .then(res=>{
    console.log(res);
  })
  .catch(err=>{
    console.log(err);
  })
}
const podaciTerapije=async()=>{
  await Terapija.deleteMany({});
  const terapije=[
    {
      detalji: 'Geštalt psihoterapija je namenjena svim uzrastima i kategorijama. Odlično se pokazala bez obzira da li je Vaša potreba da lično i profesionalno rastete i razvijate se ili se nekog  drugog razloga (fizičke bolesti, psihičkih ili emocionalnih problema) javljate na geštalt psihoterapiju.\nGeštalt psihoterapija upravo ima ulogu u tome da pronađe i uspostavi vezu između poricanog, nepriznatog i trenutnog pokreta i trenutnih potreba. Samo tada donose se, možda ne najbolje (najbezbolnije, najlagodnije), ali sigurno najadekvatnije odluke za dati trenutak.\nEksperiment je u geštalt psihoterapiji u svakodnevnom radu terapeuta od izuzetnog značaja.\nTerapeut vodi pacijenta da proba, da oseti, da doživi nešto o čemu u realnom životu i sadašnjem vremenu, možda razmišljaju i fantaziraju. Nikada se ne usude, ne osnaže sami, da želje i realizuju, jer introjekti usvojeni u detinjstvu su moćni putokazi kako je ispravno i kako treba.\nPored navedenih tehnika rada, postoje i mnoge druge, između kojih bih izdvojio i dirigovano ponašanje, fantazije, tumačenje snova. O svakoj od ovih metoda možete se saznati na prvoj, uvodnoj seansi i opredeliti se za neku od njih.',
      cena: 1800,
      tip: mongoose.Types.ObjectId('60a17c51f816ab264cf83172'),//Geštalt terapija
      terapeut: mongoose.Types.ObjectId('60a17c50f816ab264cf8316c')//Marko Markovic
    },
    {
      detalji: 'Tehnike interpersonalne terapije obuhvataju pomaganje osobi da identifikuje šta je njena emocija i odakle ona dolazi, ispoljavanje emocija – ovo uključuje pomaganje osobi da izrazi svoje emocije na zdrav način, kao I nošenje sa emocionalnim prtljagom. Ljudi često vuku sa sobom nerešena pitanja iz prethodnih veza iz njihove prošlosti i prenose u svoje svoje sadašnje odnose.\nIdeja mojih seansi je da depresija može da se leči poboljšanjem komunikacionih obrazaca i kako se ljudi odnose prema drugima, kao i kako da se poistovećuju sa drugima. \nPrva seansa  obično počinje intervjom. Na temelju problema koje opisujete, oni mogu identifikovati ciljeve i stvoriti nacrt lečenja. Tipičan program uključuje do 5 terapija nedeljno, u zavisnosti od našeg međusobnog dogovora.',
      cena:1700,
      tip: mongoose.Types.ObjectId('60a17c51f816ab264cf83173'),//Interpersonalna terapija
      terapeut: mongoose.Types.ObjectId('60a17c50f816ab264cf8316c')//Marko Markovic
    },
    {
      detalji: 'Transakciona analiza je korisna za one koji imaju problem u komunikaciji i interakciji sa drugima, mada i za sve one koji žele da poboljšaju odnose sa porodicom, okolinom, saradnicima, pa, na kraju krajeva, i za sve one koji žele da bolje razumeju samog sebe i da pri tome porade na ličnom rastu i razvoju. \nU praksi TA postoje dva principa koji proizilaze iz filozofskih pretpostavki: \n 1. Metod ugovora ističe da TA analitičar i klijent preuzimaju zajedničku odgovornost za postizanje promene koju klijent želi da postigne, odnosno, klijent, pod ugovorom, radi na svojoj želji da nešto promeni, dok mu terapeut olakšava tu promenu koristeći metode TA. \n 2. Otvorenost komunikacije znači da klijent i analitičar treba da imaju potpunu informaciju šta se dešava u njihovom zajedničkom radu. U zavisnosti od napretka klijenta određuje se broj nedeljnih, odnosno mesečnih seansi.',
      cena:1600,
      tip:mongoose.Types.ObjectId('60a17c51f816ab264cf83175'),//Transakciona analiza
      terapeut: mongoose.Types.ObjectId('60a17c50f816ab264cf8316e')//Jovan Petrovic
    },
    {
      detalji: 'Grupna psihoterapija pruža psihoterapijski tretman u formi gde obično postoji šest do dvanaest učesnika sa sličnim problemima. Ponekad terapeut može preporučiti grupnu terapiju pre nego individualnu psihoterapiju, iz raznih razloga. Jedan od razloga može biti da je grupni format bolje prilagođen za osobu ili brige sa kojima se ona nosi. \n Ljudi u grupnoj terapiji stiču poboljšanje ne samo putem intervencije terapeuta, već i kroz posmatranje drugih u grupi i primanje povratnih informacije od članova grupe. Dok grupni format, ne obezbeđuje pažnju jedan-na-jedan koju imaju pojedini formati, on poseduje nekoliko prednosti. \n Jedna od prednositi je unapređenje socijalnih veština. S obzirom na to kolika je naša svakodnevna interakcija sa drugim ljudima, mnogi ljudi nauče da unaprede svoje socijalne veštine u grupnoj terapiji (iako takva problematika ne može biti fokus grupe). Vođa grupe, terapeut, često pomaže ljudima da nauče da jasnije i efikasnije komuniciraju jedni sa drugima u okviru grupe. Ovo neminovno dovodi do toga da ljudi uče nove društvene veštine, koje mogu generalizovati i primeniti u svim svojim odnosima sa drugima. \n Takođe, cena grupne terapije iznosi oko trećinu cene individualnih terapija.Broj nedeljnih seansi se kreće od jedne do četiri i zavisi od grupe i međusobnog dogovora.',
      cena:800,
      tip:mongoose.Types.ObjectId('60a17c51f816ab264cf83174'),//Grupna terapija
      terapeut: mongoose.Types.ObjectId('60a17c50f816ab264cf8316e')//Jovan Petrovic
    },
    {
      detalji:'Moj pristup je psihodinamska integrativna psihoterapija po OLI metodu. To je vid dubinske psihoterapije koji se od drugih tehnika razlikuje po tome što nije zasnovan samo na pokušaju razrešenja određenog problema, rešavanja konkretne situacije, već na analizi dubljih slojeva naše ličnosti i dubljim promenama. \nOve dublje promene se mogu postići tek ako smo pronikli u dublju strukturu ličnosti, ako smo uklonili sve otpore koji se opiru psihoterapijskom procesu. Zato je psihodinamska psihoterapija uspešnija u onim slučajevima kada je potrebno više od instrukcija klijentu šta da radi. \nKod velikog broja ljudi takav pristup je jedini delotvoran i daje željene rezultate. Jednostavan razlog je to što većina nas ima nesvesne odbrane i otpore koji su često tvrdokorni na bilo kakve promene, i van našeg domašaja da ih prepoznamo. Iz ovih razloga, u radu sa terapeutom psihodinamske orjentacije, čak i problemi koji u svojoj osnovi imaju dubinske razloge, dostupni su za rad. Dubinski rad sa klijentom ovaj pristup čini psihodinamskim.',
      cena: 1800,
      tip:mongoose.Types.ObjectId('60a17c51f816ab264cf83170'),//Psihodinamicka terapija
      terapeut:mongoose.Types.ObjectId('60a17c50f816ab264cf8316f')//Sanja Ilic
    },
    {
      detalji:'Porodičnu terapiju određuje specifično viđenje problema, a ne broj ljudi koji dolaze na tretman, tako da moja terapija predstavlja rad sa porodicama, ali i sa parovima, organizacijama, pa i pojedincima sa kojima se radi individualna porodična terapija. Individualna porodična terapija posebno se preporučuje kod mladih osoba, kod kojih su razrešeni porodični konflikti, ali postoje dileme u pogledu sopstvenog identiteta i budućnosti, kod osoba koje žele da nauče da funkcionišu drugačije od poznatog porodičnog obrasca. \n Moje porodične terapije su skoncentrisane na rad sa sledećim temama: roditeljstvo, sterilitet, emocionalni problem dece i adolescenata, individualni i profesionalni stres.',
      cena:2200,
      tip:mongoose.Types.ObjectId('60a17c51f816ab264cf83176'),//Porodicna terapija
      terapeut: mongoose.Types.ObjectId('60a17c50f816ab264cf8316d')//Petra Ristic
    },
    {
      detalji: 'Porodica može biti najveći izvor podrške, utehe i ljubavi, ali i najveći izvor bola i tuge. Tako, porodica može istovremeno biti i deo problema i deo rešenja. Porodična terapija koja polazi od ideje da je uključivanje porodice u terapijski proces veoma dragoceno bez obzira na uzrok problema i bez obzira na to da li klijent opaža svoj tegobe kao „lični“ ili „porodični“ problem. \n Ova terapija pomaže da kuća postane dom, a da članovi porodice postanu izvor podrške i zadovoljstva, takođe pomaže članovima porodice da obnove prekinute međusobne veze, da otvoreno ispolje svoje misli i osećanja, kao i da odrede i održe adekvatne porodične uloge i pravila ponašanja. \n Moje porodične terapije su posvećene temama koje obuhvataju bračni i porodični konfilkt, alkoholizam i narkomaniju, poremećaje ponašanja, posle-porođajne depresije i anksiozna i depresivna stanja.',
      cena:2500,
      tip:mongoose.Types.ObjectId('60a17c51f816ab264cf83176'),//Porodicna terapija
      terapeut:mongoose.Types.ObjectId('60a17c50f816ab264cf8316f')//Sanja Ilic
    },
    {
      detalji: 'U odnosu na druge tipove psihoterapija Kognitivno-bihejvioralna terapija je kratkotranija i direktivnija. Očekivani psihoterapijski rezultati postižu se nakon kraćeg broja seansi, što potvrđuje značajan broj istraživanja o efikasnosti ovog vida terapije. Terapeut je veoma aktivan, on sluša, podržava, postavlja pitanja, usmerava, podučava, daje smernice i zadatke. Terapeut ne govori klijentu šta bi on „trebalo“ da oseća ili čemu bi trebalo da teži, već mu pokazuje kako – kojim načinom razmišljanja ili ponašanja će najpre ostvariti svoje ciljeve. KBT uspešno pomaže ljudima koji imaju problema sa depresijom, besom, ljubomorom, stresom, hipohondtrijom,.. \nSeanse se održavaju dva do tri puta nedeljno u trajanju od 1h. ',
      cena:1800,
      tip:mongoose.Types.ObjectId('60a17c51f816ab264cf83171'),//Kognitivno-bihejvioralna terapija
      terapeut: mongoose.Types.ObjectId('60a17c50f816ab264cf8316d')//Petra Ristic
    },

  ];
  Terapija.insertMany(terapije)
  .then(res=>{
    console.log(res);
  })
  .catch(err=>{
    console.log(err);
  })
}

const dodavanjeTerapijaTerapeutu=async()=>{
  const listaIdTerapeuta=['60a17c50f816ab264cf8316c','60a17c50f816ab264cf8316d','60a17c50f816ab264cf8316e','60a17c50f816ab264cf8316f'];
  listaIdTerapeuta.forEach(async(el)=>{
    let terapeut=await Terapeut.findById(el);
    console.log("********TERAPEUT************",terapeut)
    let listaTerapija= await Terapija.find({terapeut: el});
    listaTerapija.forEach(e=>{
      terapeut.terapije.push(e);
    })
    await terapeut.save();
    console.log("********TERAPEUT************",terapeut)
  })
}

const dodavanjeVezaTipuTerapije=async()=>{
  const listaIdTipovaTerapija=['60a17c51f816ab264cf83170','60a17c51f816ab264cf83171',
  '60a17c51f816ab264cf83172','60a17c51f816ab264cf83173','60a17c51f816ab264cf83174','60a17c51f816ab264cf83175','60a17c51f816ab264cf83176'];
  listaIdTipovaTerapija.forEach(async(el)=>{
    let tipTerapije=await TipTerapije.findById(el);
    console.log("********TIP TERAPIJE************",tipTerapije)
    let listaTerapija= await Terapija.find({tip: el});//sve terapije koje su jednog tipa
    listaTerapija.forEach(e=>{
      tipTerapije.terapije.push(e);
      tipTerapije.terapeuti.push(e.terapeut);
    })
    await tipTerapije.save();

    console.log("********TIP TERAPIJE************",tipTerapije)
  })
}

const dodavanjeTerminaTerapeutu=async()=>{
  await Termin.deleteMany({});
  const termini=[
    {
      slobodan: true,
      vreme: "15:30",
      datum: new Date("2021-07-30"),
      trajanje: "1h",
      terapeut: mongoose.Types.ObjectId('60c67a0755ad854d040634dd')
    },
    {
      slobodan: true,
      vreme: "15:30",
      datum: new Date("2021-08-28"),
      trajanje: "45 minuta",
      terapeut: mongoose.Types.ObjectId('60c67a0755ad854d040634dd')
    },
    {
      slobodan: false,
      potvrdjen:true,
      vreme: "10:45",
      datum: new Date("2021-08-22"),
      trajanje: "45 minuta",
      terapeut: mongoose.Types.ObjectId('60c67a0755ad854d040634dd'),
      terapija: mongoose.Types.ObjectId('60c8b65005dd884eecbdfe40'),
      klijent: mongoose.Types.ObjectId('60c67188c57f791300437178')
    },
    {
      slobodan: false,
      potvrdjen:false,
      vreme: "09:00",
      datum: new Date("2021-07-15"),
      trajanje: "30 minuta",
      terapeut: mongoose.Types.ObjectId('60c67a0755ad854d040634dd'),
      terapija: mongoose.Types.ObjectId('60c8b94f05dd884eecbdfe46'),
      klijent: mongoose.Types.ObjectId('60c67188c57f791300437178')
    }
  ];
  Termin.insertMany(termini)
  .then(res=>{
    console.log(res);
  })
  .catch(err=>{
    console.log(err);
  })
}

//podaciTerapeut();
//podaciTipoviTerapija();
//podaciTerapije();
//dodavanjeTerapijaTerapeutu();
//dodavanjeVezaTipuTerapije();
//dodavanjeTerminaTerapeutu();

const brisanjeTestova=async()=>{
  await Test.deleteMany({terapeut:{$ne: '60c67a0755ad854d040634dd'}});
}

const unosSavetovalista=async()=>{
  const savetovaliste=[{
    ime: "Therapy Mate",
    adresa: "Njegoseva 15",
    telefon: "060123555",
    email: "therapymate@gmail.com",
    opis: "Onog momenta kada se zapitamo da li bi za nas bilo dobro da poradimo na sebi i promenimo neka svoja gledišta,znači da smo napravili iskorak u svom razmišljanju i da imamo hrabrosti da nešto preduzmemo. Bilo da se radi o aktuelnom psihičkom stanju koje želite da promenite, stanju depresije ili anksioznosti, strahovima,odnosu sa okolinom, bračnim ili partnerskim problemima, roditeljskim ulogama, stručna pomoć psihologa doprineće rešavanju tih problema i unapređenju kvaliteta Vašeg života, što i jeste naš zajednički krajnji cilj.Iskoristite svoje mogućnosti.Zajedno ćemo naći rešenje."
  }];
  await Savetovaliste.insertMany(savetovaliste);

}
unosSavetovalista();
//brisanjeTestova();
