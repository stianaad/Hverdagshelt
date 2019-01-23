-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 23. Jan, 2019 08:53 AM
-- Tjener-versjon: 5.7.24-0ubuntu0.18.04.1
-- PHP Version: 7.2.10-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+01:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bjornost`
--

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `admin`
--

CREATE TABLE `admin` (
  `bruker_id` int(11) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `navn` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `admin`
--

INSERT INTO `admin` (`bruker_id`, `telefon`, `navn`) VALUES
(9, '41000004', 'Admin9'),
(10, '41000005', 'Admin10'),
(32, '69696969', 'BigBoi');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `ansatt`
--

CREATE TABLE `ansatt` (
  `bruker_id` int(11) NOT NULL,
  `fornavn` varchar(255) NOT NULL,
  `etternavn` varchar(255) NOT NULL,
  `telefon` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `ansatt`
--

INSERT INTO `ansatt` (`bruker_id`, `fornavn`, `etternavn`, `telefon`) VALUES
(5, 'ForAnsatt5', 'EtterAnsatt5', '41000000'),
(6, 'ForAnsatt6', 'EtterAnsatt6', '41000001'),
(33, 'Biggest', 'Boi', '00000000');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `bedrift`
--

CREATE TABLE `bedrift` (
  `bruker_id` int(11) NOT NULL,
  `orgnr` int(9) NOT NULL,
  `navn` varchar(255) NOT NULL,
  `telefon` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `bedrift`
--

INSERT INTO `bedrift` (`bruker_id`, `orgnr`, `navn`, `telefon`) VALUES
(7, 1200600, 'Bedrift7', '41000002'),
(8, 1200601, 'Bedrift8', '41000003'),
(25, 120060080, 'Deodeodeo', '41499675');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `bruker`
--

CREATE TABLE `bruker` (
  `bruker_id` int(11) NOT NULL,
  `epost` varchar(255) NOT NULL,
  `passord` text NOT NULL,
  `kommune_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `bruker`
--

INSERT INTO `bruker` (`bruker_id`, `epost`, `passord`, `kommune_id`) VALUES
(1, 'epost1@hotmail.com', 'pbkdf2$10000$27a880d549406e69c50f398494622256315c3b92bb56631a8a59369d0fabcb20dab5d980e457860167c3f027f6d7a4936062d0653c6a288b5499834d131d71e4$cd0de5bd29ecf470ba70c2983307f6ab8feceb1e210b4b532ff35df7f806c3a560b1a5822f980758539a594b777f35b7ebb9e37c25c5f9cb03aae93b046b1bf8', 12),
(2, 'epost2@hotmail.com', 'passord2', 24),
(3, 'epost3@hotmail.com', 'passord3', 333),
(4, 'epost4@hotmail.com', 'passord4', 351),
(5, 'epost5@hotmail.com', 'passord5', 51),
(6, 'epost6@hotmail.com', 'passord6', 67),
(7, 'epost7@hotmail.com', 'passord7', 257),
(8, 'epost8@hotmail.com', 'passord8', 128),
(9, 'epost9@hotmail.com', 'passord9', 359),
(10, 'epost10@hotmail.com', 'passord10', 150),
(11, 'epost11@hotmail.com', 'pbkdf2$10000$64c2446101f5fa79b1a0d0bd7f6be19a3e138357c0615f29bed4a7b2daa834e808e3055d2cb1ca2d02c8738e57336381be77b502efacc802f2094568abc069a6$4849f30fe43a9097fc54001f0451679e6c3d65b725e4603e8dd2777ffc40238951df60698d534eacbb472b8a9c8c871966443d620af0ffdbccf3a0ea45ec5342', 12),
(13, 'stianaad@stud.ntnu.no', 'pbkdf2$10000$efd4994eeb0e3b29112703efaf21035cc2e6418a2a1845f4d6cbee0912190a3f30359ef2710310f61bf53419cfd5e2d799151038c2139b54482c159ea0a89c3e$73eded0504fb311805f336be3947cb884840526a8e309212147a158d0532d27fead2c196fa0b7d0be16892e9adccda5820b92170b5e0c0a35fc8e30fa1eb9bf1', 197),
(14, 'juni.leirvik@gmail.com', 'pbkdf2$10000$bdea647d0636e718d3431932cef404b1888d4abc7be81399e1981c34f6d955ff6044f53a384ca2cd587afd71cc2d54967f26c1765f8c78d63473396231bc2ed4$9a3dfca3e7a63235baa4abeda2797e4b8b8968d94602663947f3333f46fd8a961495a7c522364549a24dd7e3b58ef14484c4ec12f56f3b5c86dfa910dba96e3b', 153),
(16, 'bjosttveit@gmail.com', 'pbkdf2$10000$5101c5188a873d684fc7c7417af19328f1b1c9914fe8398369f38bdfabbf30d638218b45b670c92fcb46ed4b1d805cda7f2dbd818cbccb20a16d7e5c13ec1615$0d5b599071ed6014594275a8fa420e554b939463af7132e23d99bea69483805137fa554d35c03743172e71b07e2d022db069be91357f718fe458d33385877fd5', 128),
(17, 'stian_adnanes@hotmail.com', 'pbkdf2$10000$2a94eb529e7e8209c58db08c14a83744a374284bc867bfeee25a2dd9c607224ff3da74d8f8e9512ef419fa31c4b5c386c39f95ac7b55bd3ad9e4d06c09e92d33$e3886e9699e906223f8ff00287b67af2eb24e58db206d8a16668dba759247dfa7ab3563c0b30482f8948e39de407512d0a6b2573af295bb299958ea50aecd689', 197),
(18, 'sarahj.98@hotmail.com', 'pbkdf2$10000$a97b1afb7b0a4dab5b177e4686e2eb195287968c7d12faa3d7e8129fbefc5ed824dc4cc4005dc3dbd83dd3eab24001f78bb461c79ceaef70955f970034f99436$9b210c485b9bd2669d457eaec943e2405ada3bb60035bb5adb0441401217199734759ff6308231e87cf2e03734a546f03c225b29a1bd200060c201a0dd362e86', 289),
(20, 'oivindlarsson@gmail.com', 'pbkdf2$10000$0e91708b1b21984800b47a3eda812358372de360295f070ff6ff5fcd50be6bf7680dfaeaa574786ee4aa99b00d5161d74aa45da57f62d43e43f84a1d925136e4$dc7fd9f10506c085c9c6fb8ef357c650acd4bba17cec5a44aed1fcc9c30b3759618f39a955c026148768892e9ce80573fe27724cb429f2717c0e77227f5b615d', 23),
(22, 'andershallemiversen@hotmail.com', 'pbkdf2$10000$5823209dba67c7559be4c1f6653da21d8ee6c597e65beaae57194ee0eb118e2be4a2c7b34f60d99b946f4d7b06d8873dbfa918a4a8c2e4381ee4ac0e0bf29f6c$881fca0f77d897ddceacc637d875135b838525b3c62fc35ee3b9c0bb9e0dd11f303d019a71d6097979e0e09ec56bc4bb4ae4926a50754444ff0252bfe75d5a98', 290),
(25, 'deo@deo.com', 'pbkdf2$10000$27d33d6429afafccdb0d41f5650c25a12c07bbbf3f5b99a989498b42e6b6fe000cf829565958fd9c064c90c530035cd4f36f5b8639b245bd656bd0f01863808d$5673eb413e1d0ea99db65ba00312d86c699a86199318f991204c8347e5d0a5dff837fa0601086218f6b01a39ec94ce59b166928d748b860f238c0139078dc021', 66),
(31, 'andersson.98@gmail.com', 'pbkdf2$10000$452ac31732e2e97259be407479d45c02eade4e3c4bddb4efefe9832b60a7889e29356c9687ce1cdd82cfddbfb24f8d234ce3fb12c4f9988923f723655daa4abe$47985707a81dbbec8bda22e75c52d6556092decdfbb8e08c89f7b59774168402f0684f5c04505f651a4ce5621c3d97eb8109584790488dd3999fa19d2aeb2535', 4),
(32, 'zimzim@zim.com', 'pbkdf2$10000$03908cadd5c903a819f21a37310077790d1d6d21a4e66b9377462a415f6824ef12b8a43d778dbf7b33ec7068dd5c3cf506589ea5679fb0f4e910616e78c719f3$e91fe488e2df4f6fd7a6cbb61936ac6866ac4106fe979b5c6826424b23e52e71b72166e820b170e7d622d75a60a801c27e31770296b0dd97f3ec7487e27607eb', 69),
(33, 'big@boi.com', 'pbkdf2$10000$757bfadd8d5473046fd3e0313457103cf778202bd0b1312cc687ecbc6a9df052accf29a96a869221656c354d4c90b2afe129412f2356cc398ed2d6c09df54f36$494a20c4ba4c5deedc7122570ea8e73531c919af49aa96f5f3d891d85c7ae8bd3fca47e3d24f084a619d59722f8d70d9e7d1b832f67671a2437be9cf1468b465', 69),
(34, 'r.vedoy@gmail.com', 'pbkdf2$10000$24b9fb1511016b3d550272a6a75029c9250dc9e0ae73ff4273ec2db29c434fa6a7f896768102a9880995f1dc60b6c46682cb8ed2f09fbfc031599968f7ad285c$6331a84d10b83f4536bb11771422368a9e996480781628be6fe081e32c720b934073d55fc49f6d389a752f09d89077152368256bb0e49d9b591be818fea82fdf', 191);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `feil`
--

CREATE TABLE `feil` (
  `feil_id` int(11) NOT NULL,
  `bruker_id` int(11) NOT NULL,
  `kommune_id` int(11) NOT NULL,
  `subkategori_id` int(11) NOT NULL,
  `overskrift` varchar(255) NOT NULL,
  `beskrivelse` text NOT NULL,
  `lengdegrad` double NOT NULL,
  `breddegrad` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `feil`
--

INSERT INTO `feil` (`feil_id`, `bruker_id`, `kommune_id`, `subkategori_id`, `overskrift`, `beskrivelse`, `lengdegrad`, `breddegrad`) VALUES
(1, 11, 1, 1, 'Overskrift1', 'Beskrivelse1', 0.1, 0),
(2, 2, 20, 2, 'Overskrift2', 'Beskrivelse2', 0, 0.2),
(3, 2, 30, 3, 'Overskrift3', 'Beskrivelse3', 0.3, 0.3),
(4, 17, 40, 4, 'Overskrift4', 'Beskrivelse4', 0.4, 4),
(5, 3, 50, 1, 'Overskrift5', 'Beskrivelse5', 5, 5),
(6, 6, 60, 2, 'Overskrift6', 'Beskrivelse6', 60, 6),
(9, 1, 392, 1, 'wedwed', 'wedwe', 10.391934438687038, 63.42963170221657),
(16, 1, 289, 5, 'demo', 'Dette er ein test', 10.388704535817515, 63.42903422391718),
(17, 1, 289, 6, 'Test2', 'Jeg liker superhero burger', 10.402635137528693, 63.433224519678795),
(18, 17, 81, 5, 'GooOOOdDDAmmn', 'Nå skjer det grabbar', 10.48059962820844, 60.40181496236127),
(19, 17, 81, 1, 'Sugpikkenmin', 'BOIIIIIIIIIIIIIIIIIIIIIIIIII', 10.478651509174828, 60.396563150942235),
(20, 17, 4, 6, 'Hull i veien ved Torvbyen', 'FAEN I HELVETE JEG HATER DEN JÆVLA KOMMUNEN SOM ALDRI ÅRNER I VEIENE SINE JEG GÅR SÅJÆÆÆVLA LEI!!!11111EN', 10.937939909320484, 59.21496289990943),
(21, 17, 290, 5, 'Det er snø ved bussholdeplassen', 'Dette er helt jævlig! :D', 11.489542998507007, 64.0157810425162),
(22, 17, 322, 1, 'Temp', 'HVA??', 10.406860145821717, 63.4095585741489),
(23, 17, 289, 5, 'jævla helvette!!!!!1111en', 'Nu e æ førrbainna, altså. Fy faen, førr nokko førrbainnada skjit. Kem i hælvett e det som har fuinne opp det herre satans makkverket. Det går da fan-steike-helvete ikkje ant å hoilde på å kuke med det here i vekkesvik, ....Main har da førr faen ainner ting å gjøre einn å sette der å fettle og baille med den satans musejævelen.\n\nKainn du innst inni grønnskodden tykjeræva førrtelle ka som er vitsen med nokka jernskrammel som står der og gneill og hyle med en masse hælvetes lyda og blinke og blafre uta fan, og passord og ledninge og knotta som tyt ut som han tykjen overalt. Æ måtte berre ha fådd tak i en av dokker, dokker helvetes kukklæsta av nån suppoert gakkgakka, så skuill æ vel fansøkki ha rævkjørt dokker dit dokker høre heime, satans utvrengte fette av nån hestkuka. Kom fan ikkje hit å lur mainskit på folk, åførtælle ka\n\næ skal trøkke, din satans gjeddepeis.\n\nVa det opp te mæ skulle dokker ha vært på ishave og ronka kobbekuk, førbainna søringsatana, så kunne dokker ha sotte å konfigurert dokker sjøl så utavhælvettes lang opp ide utpulte ræven dokkers at dokker måtte sjite utav æran neste gang dokker måtte på dass, og når dokker va færdi me det, så sku æ personlig ha kommen å formatert trynan dokkers, å installert skanken oppi baillhånka dokkers sånn at dokker kom tel å pesse røde serienummer.\n\nSkulle det ennu spenneliv i dokker etter dette, så sku æ ha pluga og plyd dokker så utavhælvettes langt inn i det største rævhållet æ har funne. Og da sku det ha lokta mainnskjit av dokker heilt te dokker daua. Førr faen steike innst inn i det heiteste utsvidde hævlvette for satan, la mæ få tak i omså bare en av dokker.\n\nÆ har da vel førr helvete slette hauet av hysjævla før.\n\nkommer te å måkke heile den forbainna skiten i eska og sende ho i retur. æ vil fan ikkje ha han. Så kan dokker te helvete sette der å ronke aleine i den helsikes telefin dokkers.', 10.398889163971946, 63.437692840824596),
(25, 17, 81, 1, 'STILLLLLLOOONGSzzZ', 'Øyh, this is Fattern keepin\' it down for the stilongs!Jeg har stilongs på meg nå,\nfor nå skal jeg ut og gå.\nHåper jeg ikke blir slått ned,\nhåper bøllene lar meg være i fred.Nø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nStilongs er best, ingen protest.Ja, jeg ruker stilongs men ikke bukse,\npersonlig så mener jeg det blir å jukse, det er jo helt vanlig tankegang,\nså jeg går kun i stilongs vinter\'n lang.Stilongs er så hælvetes tøft,\nstilongs gir hele tilværelsen et løft.\nStilongs er så hælvetes tøft,\nja, stilongs gir hele tilværelsen et løft.\nGjennomsiktig stilongs er det som er best,\ndet er det jeg bruker mest.\nJeg bruker ikke særlig mange andre plagg.\nJeg kjøper dem kun på billigsalg.Har intet annet valg.\nOmtrent.\nNei.\nJeg er fattig.\nFattig som faen.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nStilongs er best, ingen protest.Stilongs er så hælvetes tøft,\nstilongs gir hele tilværelsen et løft.\nStilongs det er så hælvetes tøft,\nja, stilongs gir hele tilværelsen et løft.\nHei, hei, hei, hei!\nHo, ho, ho, ho!\nYo, yo, yo, yo!\nLet\'s go, go, go!\nWith the flow, yo!Check it out!\nIntroducing,\nto all yo\':\nSteinar!Hei!Nø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nStilongs er best, fred med en hest,\nmen jeg vil ha pung i hø, hø, eh...Ka skjer?', 0, 0),
(26, 17, 81, 1, 'STILLLLLLOOONGSzzZ', 'Øyh, this is Fattern keepin\' it down for the stilongs!Jeg har stilongs på meg nå,\nfor nå skal jeg ut og gå.\nHåper jeg ikke blir slått ned,\nhåper bøllene lar meg være i fred.Nø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nStilongs er best, ingen protest.Ja, jeg ruker stilongs men ikke bukse,\npersonlig så mener jeg det blir å jukse, det er jo helt vanlig tankegang,\nså jeg går kun i stilongs vinter\'n lang.Stilongs er så hælvetes tøft,\nstilongs gir hele tilværelsen et løft.\nStilongs er så hælvetes tøft,\nja, stilongs gir hele tilværelsen et løft.\nGjennomsiktig stilongs er det som er best,\ndet er det jeg bruker mest.\nJeg bruker ikke særlig mange andre plagg.\nJeg kjøper dem kun på billigsalg.Har intet annet valg.\nOmtrent.\nNei.\nJeg er fattig.\nFattig som faen.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nStilongs er best, ingen protest.Stilongs er så hælvetes tøft,\nstilongs gir hele tilværelsen et løft.\nStilongs det er så hælvetes tøft,\nja, stilongs gir hele tilværelsen et løft.\nHei, hei, hei, hei!\nHo, ho, ho, ho!\nYo, yo, yo, yo!\nLet\'s go, go, go!\nWith the flow, yo!Check it out!\nIntroducing,\nto all yo\':\nSteinar!Hei!Nø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nNø, nø, nø, nø, nø, nø, nø, nø stilongs.\nStilongs er best, fred med en hest,\nmen jeg vil ha pung i hø, hø, eh...Ka skjer?', 0, 0),
(27, 17, 81, 1, 'Telefonmaddafakka', 'Jeg er tøff', 0, 0),
(28, 16, 289, 5, '', 'stian har en svær kuk i panna', 0, 0),
(29, 16, 289, 2, '', 'stian har fått en stor utvekst av penis i sin panne xD', 10.39073538798559, 63.42901742723374),
(30, 16, 289, 5, '', 'kan noen pls fikse dette', 0, 0),
(31, 16, 289, 1, 'STIAN SPISER PIKK TIL LUNSJ', 'stian er homo men hva er det forno', 0, 0),
(32, 16, 289, 1, 'kuk', '123 haha', 0, 0),
(33, 16, 289, 1, 'pikk i trynet', 'lol213', 0, 0),
(34, 31, 4, 1, 'spaghetti', 'dash', 10.261159864148915, 63.42963170221657),
(35, 31, 289, 1, 'Spaghetti i lomma fuckkkkk', 'nei nei nei ikke igjen!!!', 10.394367294216192, 63.429938834769914),
(36, 32, 289, 1, 'POST ANKOMMET', 'Melder ei litta sesh med ex on the beach Sverige, ostepop og eventyrbrus', 10.451893155753359, 63.43925362770437),
(37, 31, 4, 6, 'Dab', 'Spaghetti faen', 10.391950335795228, 63.42958782634578),
(38, 16, 289, 1, 'Rotter på ntnu kalvskinnet', 'Der er observert rotter på skolen, kan noen vennligst destruere disse snarest.', 10.388913784591905, 63.4285375157409),
(39, 16, 128, 1, 'Kuk', 'Hei', 10.397512731977285, 63.43116733206363),
(40, 16, 289, 1, 'Skadedyr på hytte i åre', 'Æsj', 13.177877141255504, 63.32748155667726),
(41, 16, 289, 1, 'e', 'e', 10.392272745716069, 63.429324566371164),
(42, 16, 375, 1, 'e', 'e', 10.365495860316766, 63.4164218878172),
(43, 20, 289, 1, 'The next Adolf?', 'Stepper inn på festen, lukter chæmpis og 00,\nbli med til plantasjen, du skal plukke bomull', 10.453708607361206, 63.43712991436412),
(44, 16, 128, 1, 'a', 'a', 10.381144899999999, 63.43390629999999);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `feilbilder`
--

CREATE TABLE `feilbilder` (
  `bilde_id` int(11) NOT NULL,
  `feil_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `feilbilder`
--

INSERT INTO `feilbilder` (`bilde_id`, `feil_id`, `url`) VALUES
(1, 1, 'https://bjornost.tihlde.org/hverdagshelt/b25b28c741e520d695615dee3ac2dc4a'),
(2, 2, 'https://bjornost.tihlde.org/hverdagshelt/b013fad50c0d518f4384d842ab451547'),
(3, 3, 'https://bjornost.tihlde.org/hverdagshelt/ac78b6d904ceb783e9da802a5c84ea7b'),
(4, 4, 'https://bjornost.tihlde.org/hverdagshelt/135d6d0f44a6ba73e3782c243663b90a'),
(5, 5, 'https://bjornost.tihlde.org/hverdagshelt/19af4f8c745a62973e2cd615eaf329fa'),
(6, 9, 'https://bjornost.tihlde.org/hverdagshelt/73340a0f40b99fb98c40b8c161338464'),
(19, 16, 'https://bjornost.tihlde.org/hverdagshelt/2e5235fc5ae22b77016dda1c3cea33ca'),
(20, 19, 'https://bjornost.tihlde.org/hverdagshelt/91c0a9eb75093e421eec0e55aef38f1b'),
(21, 20, 'https://bjornost.tihlde.org/hverdagshelt/b76c4a7e387814eabc96dc96f43b26f0'),
(22, 21, 'https://bjornost.tihlde.org/hverdagshelt/d6191821b7edc156dd5544ebdc75aef1'),
(23, 21, 'https://bjornost.tihlde.org/hverdagshelt/2d165757b7d31f5bc5e4202dd211da9a'),
(24, 21, 'https://bjornost.tihlde.org/hverdagshelt/3496272127733ffc7a2ab01a15c3758a'),
(25, 21, 'https://bjornost.tihlde.org/hverdagshelt/ddbbfc9ad1c99145e285788a6e49dc81'),
(26, 21, 'https://bjornost.tihlde.org/hverdagshelt/51fff2d97740bb16a2f5020dc7dfaf16'),
(27, 21, 'https://bjornost.tihlde.org/hverdagshelt/3f343ed097da040d5f0894f756d55e95'),
(28, 23, 'https://bjornost.tihlde.org/hverdagshelt/b8b821e11933ee646561675bc8b52884'),
(29, 25, 'https://bjornost.tihlde.org/hverdagshelt/a594c912eb5392d230dcb79f8ae76b62'),
(30, 26, 'https://bjornost.tihlde.org/hverdagshelt/fb5a9c58ae121fb3a9713029ce01610f'),
(31, 27, 'https://bjornost.tihlde.org/hverdagshelt/8f5529affd818fb586914893b965ea94'),
(32, 28, 'https://bjornost.tihlde.org/hverdagshelt/9d9062c1fde43236a3794126a48497d7'),
(33, 28, 'https://bjornost.tihlde.org/hverdagshelt/a0f1d9c93ee1790d84d53f9b07c3a3c6'),
(34, 28, 'https://bjornost.tihlde.org/hverdagshelt/f7e21a65e00ed0dc7978fdc8fa8202ca'),
(35, 28, 'https://bjornost.tihlde.org/hverdagshelt/3feaa561c0aedc1886f7071c6c8073de'),
(36, 28, 'https://bjornost.tihlde.org/hverdagshelt/7a6598c772f0c0d6bc066f7f60651b9c'),
(37, 29, 'https://bjornost.tihlde.org/hverdagshelt/fe95a902227a30eb2b34de0084c5e9a6'),
(38, 29, 'https://bjornost.tihlde.org/hverdagshelt/802c0d1582129966fe7ec2a12c3c91c2'),
(39, 29, 'https://bjornost.tihlde.org/hverdagshelt/ed65a1f87aeffd652a347c2e3166ebae'),
(40, 30, 'https://bjornost.tihlde.org/hverdagshelt/5ede58d6ce4ea78b1126b2406333951a'),
(41, 31, 'https://bjornost.tihlde.org/hverdagshelt/5f96fbca6a580f48d1cb6cc36f17c3a0'),
(42, 33, 'https://bjornost.tihlde.org/hverdagshelt/890c8d6db7ea4b5477b90bf4475eaf89'),
(43, 36, 'https://bjornost.tihlde.org/hverdagshelt/f282eecaf42398d3966618a8dd0708c1'),
(44, 37, 'https://bjornost.tihlde.org/hverdagshelt/50e6b43425e44059a706e3597d5f9545'),
(45, 38, 'https://bjornost.tihlde.org/hverdagshelt/6c463f0f2370c747b186e3d508449153'),
(46, 39, 'https://bjornost.tihlde.org/hverdagshelt/d36e11d2e8c2fc800f26b200ebf27e05'),
(47, 40, 'https://bjornost.tihlde.org/hverdagshelt/0f195ea03d6447a42e5ca8c94381b01b'),
(48, 43, 'https://bjornost.tihlde.org/hverdagshelt/cafa241c9903a3994aab66230db15a74');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `feilfolg`
--

CREATE TABLE `feilfolg` (
  `feil_id` int(11) NOT NULL,
  `bruker_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `feilfolg`
--

INSERT INTO `feilfolg` (`feil_id`, `bruker_id`) VALUES
(1, 11),
(2, 11),
(32, 16),
(33, 16),
(38, 16),
(39, 16),
(40, 16),
(41, 16),
(42, 16),
(44, 16),
(20, 17),
(22, 17),
(31, 20),
(36, 20),
(43, 20),
(2, 31),
(17, 31),
(19, 31),
(20, 31),
(21, 31),
(23, 31),
(27, 31),
(33, 31),
(34, 31),
(35, 31),
(37, 31),
(36, 32);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `fylker`
--

CREATE TABLE `fylker` (
  `fylke_navn` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `fylker`
--

INSERT INTO `fylker` (`fylke_navn`) VALUES
('Akershus'),
('Aust-Agder'),
('Buskerud'),
('Finnmark'),
('Hedmark'),
('Hordaland'),
('Møre og Romsdal'),
('Nordland'),
('Oppland'),
('Oslo'),
('Rogaland'),
('Sogn og Fjordane'),
('Telemark'),
('Troms'),
('Trøndelag'),
('Vest-Agder'),
('Vestfold'),
('Østfold');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `hendelser`
--

CREATE TABLE `hendelser` (
  `hendelse_id` int(11) NOT NULL,
  `bruker_id` int(11) NOT NULL,
  `hendelseskategori_id` int(11) NOT NULL,
  `kommune_id` int(11) NOT NULL,
  `overskrift` varchar(255) NOT NULL,
  `tid` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `beskrivelse` text,
  `sted` varchar(255) NOT NULL,
  `bilde` varchar(255) DEFAULT NULL,
  `lengdegrad` double DEFAULT NULL,
  `breddegrad` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `hendelser`
--

INSERT INTO `hendelser` (`hendelse_id`, `bruker_id`, `hendelseskategori_id`, `kommune_id`, `overskrift`, `tid`, `beskrivelse`, `sted`, `bilde`, `lengdegrad`, `breddegrad`) VALUES
(1, 5, 1, 197, 'Overskrift1', '2019-01-22 10:14:00', 'Beskrivelse1', 'Sted1', 'https://bjornost.tihlde.org/hverdagshelt/135d6d0f44a6ba73e3782c243663b90a', 0, 0),
(2, 6, 2, 12, 'Overskrift2', '2019-12-19 23:00:00', 'Beskrivelse2', 'Sted2', 'https://bjornost.tihlde.org/hverdagshelt/19af4f8c745a62973e2cd615eaf329fa', 1, 0.1),
(3, 5, 1, 19, 'Overskrift3', '2019-01-21 21:23:35', 'Beskrivelse 3', 'Sted3', 'https://bjornost.tihlde.org/hverdagshelt/b013fad50c0d518f4384d842ab451547?fbclid=IwAR02mau81HfcUbchFiCpPZSLE1BAkE1lxM8zzmsnt9QSp8GCQHwVPIpulxI', 0, 0),
(4, 33, 1, 289, 'Samene KOMMER!', '2019-01-22 12:41:16', 'SAMENE ER FUCKINGS PÅ VEI', 'Samfundet', 'https://www.gannett-cdn.com/-mm-/79b31a65f53604ed7457a9c5d965d3080d3871c8/c=2-0-564-423/local/-/media/2017/06/15/DetroitFreeP/DetroitFreePress/636331136177408398-big-boy.jpg?width=534&height=401&fit=crop', 59, 39),
(5, 33, 1, 69, 'Test', '2019-01-25 20:04:00', 'Test', 'Adresse 1', 'lofoten.jpg', 0, 0),
(6, 33, 1, 289, 'Yoga for støle menn!', '2019-01-22 13:05:18', 'Er du støl? Er du mann? Svarte du ja på to av to spørsmål MÅ du på yoga', 'Stjørdal', 'https://nvio.no/wp-content/uploads/2019/01/youga.jpg', 59, 39),
(7, 33, 2, 69, 'SCRUM TAR OVEEEEEEEEEEEEER', '2019-01-24 01:57:00', 'HJEEEEEEEEEEEEEEEEEEELP', 'Klasserom 404', 'lofoten.jpg', 0, 0),
(8, 33, 1, 69, 'Test', '2019-01-25 22:32:00', 'test', 'tjoho', 'lofoten.jpg', 0, 0);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `hendelseskategori`
--

CREATE TABLE `hendelseskategori` (
  `hendelseskategori_id` int(11) NOT NULL,
  `kategorinavn` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `hendelseskategori`
--

INSERT INTO `hendelseskategori` (`hendelseskategori_id`, `kategorinavn`) VALUES
(1, 'HendelseKat1'),
(2, 'HendelseKat2');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `hendfolg`
--

CREATE TABLE `hendfolg` (
  `hendelse_id` int(11) NOT NULL,
  `bruker_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `hendfolg`
--

INSERT INTO `hendfolg` (`hendelse_id`, `bruker_id`) VALUES
(1, 17),
(2, 17);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `hovedkategori`
--

CREATE TABLE `hovedkategori` (
  `hovedkategori_id` int(11) NOT NULL,
  `kategorinavn` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `hovedkategori`
--

INSERT INTO `hovedkategori` (`hovedkategori_id`, `kategorinavn`) VALUES
(1, 'Hovedkategori1'),
(2, 'Hovedkategori2'),
(3, 'Hovedkategori3'),
(4, 'Hovedkategori4');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `jobbSoknad`
--

CREATE TABLE `jobbSoknad` (
  `bruker_id` int(11) NOT NULL,
  `feil_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '2'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `jobbSoknad`
--

INSERT INTO `jobbSoknad` (`bruker_id`, `feil_id`, `status`) VALUES
(25, 2, 4),
(25, 3, 4);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `kommuner`
--

CREATE TABLE `kommuner` (
  `kommune_id` int(11) NOT NULL,
  `kommune_navn` varchar(255) NOT NULL,
  `fylke_navn` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `kommuner`
--

INSERT INTO `kommuner` (`kommune_id`, `kommune_navn`, `fylke_navn`) VALUES
(1, 'Halden', 'Østfold'),
(2, 'Moss', 'Østfold'),
(3, 'Sarpsborg', 'Østfold'),
(4, 'Fredrikstad', 'Østfold'),
(5, 'Hvaler', 'Østfold'),
(6, 'Aremark', 'Østfold'),
(7, 'Marker', 'Østfold'),
(8, 'Rømskog', 'Østfold'),
(9, 'Trøgstad', 'Østfold'),
(10, 'Spydeberg', 'Østfold'),
(11, 'Askim', 'Østfold'),
(12, 'Eidsberg', 'Østfold'),
(13, 'Skiptvet', 'Østfold'),
(14, 'Rakkestad', 'Østfold'),
(15, 'Råde', 'Østfold'),
(16, 'Rygge', 'Østfold'),
(17, 'Våler, Østfold', 'Østfold'),
(18, 'Hobøl', 'Østfold'),
(19, 'Vestby', 'Akershus'),
(20, 'Ski', 'Akershus'),
(21, 'Ås', 'Akershus'),
(22, 'Frogn', 'Akershus'),
(23, 'Nesodden', 'Akershus'),
(24, 'Oppegård', 'Akershus'),
(25, 'Bærum', 'Akershus'),
(26, 'Asker', 'Akershus'),
(27, 'Aurskog-Høland', 'Akershus'),
(28, 'Sørum', 'Akershus'),
(29, 'Fet', 'Akershus'),
(30, 'Rælingen', 'Akershus'),
(31, 'Enebakk', 'Akershus'),
(32, 'Lørenskog', 'Akershus'),
(33, 'Skedsmo', 'Akershus'),
(34, 'Nittedal', 'Akershus'),
(35, 'Gjerdrum', 'Akershus'),
(36, 'Ullensaker', 'Akershus'),
(37, 'Nes, Akershus', 'Akershus'),
(38, 'Eidsvoll', 'Akershus'),
(39, 'Nannestad', 'Akershus'),
(40, 'Hurdal', 'Akershus'),
(41, 'Oslo', 'Oslo'),
(42, 'Kongsvinger', 'Hedmark'),
(43, 'Hamar', 'Hedmark'),
(44, 'Ringsaker', 'Hedmark'),
(45, 'Løten', 'Hedmark'),
(46, 'Stange', 'Hedmark'),
(47, 'Nord-Odal', 'Hedmark'),
(48, 'Sør-Odal', 'Hedmark'),
(49, 'Eidskog', 'Hedmark'),
(50, 'Grue', 'Hedmark'),
(51, 'Åsnes', 'Hedmark'),
(52, 'Våler, Hedmark', 'Hedmark'),
(53, 'Elverum', 'Hedmark'),
(54, 'Trysil', 'Hedmark'),
(55, 'Åmot', 'Hedmark'),
(56, 'Stor-Elvdal', 'Hedmark'),
(57, 'Rendalen', 'Hedmark'),
(58, 'Engerdal', 'Hedmark'),
(59, 'Tolga', 'Hedmark'),
(60, 'Tynset', 'Hedmark'),
(61, 'Alvdal', 'Hedmark'),
(62, 'Folldal', 'Hedmark'),
(63, 'Os, Hedmark', 'Hedmark'),
(64, 'Lillehammer', 'Oppland'),
(65, 'Gjøvik', 'Oppland'),
(66, 'Dovre', 'Oppland'),
(67, 'Lesja', 'Oppland'),
(68, 'Skjåk', 'Oppland'),
(69, 'Lom', 'Oppland'),
(70, 'Vågå', 'Oppland'),
(71, 'Nord-Fron', 'Oppland'),
(72, 'Sel', 'Oppland'),
(73, 'Sør-Fron', 'Oppland'),
(74, 'Ringebu', 'Oppland'),
(75, 'Øyer', 'Oppland'),
(76, 'Gausdal', 'Oppland'),
(77, 'Østre Toten', 'Oppland'),
(78, 'Vestre Toten', 'Oppland'),
(79, 'Jevnaker', 'Oppland'),
(80, 'Lunner', 'Oppland'),
(81, 'Gran', 'Oppland'),
(82, 'Søndre Land', 'Oppland'),
(83, 'Nordre Land', 'Oppland'),
(84, 'Sør-Aurdal', 'Oppland'),
(85, 'Etnedal', 'Oppland'),
(86, 'Nord-Aurdal', 'Oppland'),
(87, 'Vestre Slidre', 'Oppland'),
(88, 'Øystre Slidre', 'Oppland'),
(89, 'Vang', 'Oppland'),
(90, 'Drammen', 'Buskerud'),
(91, 'Kongsberg', 'Buskerud'),
(92, 'Ringerik', 'Buskerud'),
(93, 'Hole', 'Buskerud'),
(94, 'Flå', 'Buskerud'),
(95, 'Nes, Buskerud', 'Buskerud'),
(96, 'Gol', 'Buskerud'),
(97, 'Hemsedal', 'Buskerud'),
(98, 'Ål', 'Buskerud'),
(99, 'Hol', 'Buskerud'),
(100, 'Sigdal', 'Buskerud'),
(101, 'Krødsherad', 'Buskerud'),
(102, 'Modum', 'Buskerud'),
(103, 'Øvre Eiker', 'Buskerud'),
(104, 'Nedre Eike', 'Buskerud'),
(105, 'Lier', 'Buskerud'),
(106, 'Røyken', 'Buskerud'),
(107, 'Hurum', 'Buskerud'),
(108, 'Flesberg', 'Buskerud'),
(109, 'Rollag', 'Buskerud'),
(110, 'Nore og Uvdal', 'Buskerud'),
(111, 'Horten', 'Vestfold'),
(112, 'Tønsberg', 'Vestfold'),
(113, 'Sandefjord', 'Vestfold'),
(114, 'Svelvik', 'Vestfold'),
(115, 'Larvik', 'Vestfold'),
(116, 'Sande, Vestfold', 'Vestfold'),
(117, 'Holmestrand', 'Vestfold'),
(118, 'Re', 'Vestfold'),
(119, 'Færder', 'Vestfold'),
(120, 'Porsgrunn', 'Telemark'),
(121, 'Skien', 'Telemark'),
(122, 'Notodden', 'Telemark'),
(123, 'Siljan', 'Telemark'),
(124, 'Bamble', 'Telemark'),
(125, 'Kragerø', 'Telemark'),
(126, 'Drangedal', 'Telemark'),
(127, 'Nome', 'Telemark'),
(128, 'Bø, Telemark', 'Telemark'),
(129, 'Sauherad', 'Telemark'),
(130, 'Tinn', 'Telemark'),
(131, 'Hjartdal', 'Telemark'),
(132, 'Seljord', 'Telemark'),
(133, 'Kviteseid', 'Telemark'),
(134, 'Nissedal', 'Telemark'),
(135, 'Fyresdal', 'Telemark'),
(136, 'Tokke', 'Telemark'),
(137, 'Vinje', 'Telemark'),
(138, 'Risør', 'Aust-Agder'),
(139, 'Grimstad', 'Aust-Agder'),
(140, 'Arendal', 'Aust-Agder'),
(141, 'Gjerstad', 'Aust-Agder'),
(142, 'Vegårshei', 'Aust-Agder'),
(143, 'Tvedestrand', 'Aust-Agder'),
(144, 'Froland', 'Aust-Agder'),
(145, 'Lillesand', 'Aust-Agder'),
(146, 'Birkenes', 'Aust-Agder'),
(147, 'Åmli', 'Aust-Agder'),
(148, 'Iveland', 'Aust-Agder'),
(149, 'Evje og Hornnes', 'Aust-Agder'),
(150, 'Bygland', 'Aust-Agder'),
(151, 'Valle', 'Aust-Agder'),
(152, 'Bykle', 'Aust-Agder'),
(153, 'Kristiansand', 'Vest-Agder'),
(154, 'Mandal', 'Vest-Agder'),
(155, 'Farsund', 'Vest-Agder'),
(156, 'Flekkefjord', 'Vest-Agder'),
(157, 'Vennesla', 'Vest-Agder'),
(158, 'Songdalen', 'Vest-Agder'),
(159, 'Søgne', 'Vest-Agder'),
(160, 'Marnardal', 'Vest-Agder'),
(161, 'Åseral', 'Vest-Agder'),
(162, 'Audnedal', 'Vest-Agder'),
(163, 'Lindesnes', 'Vest-Agder'),
(164, 'Lyngdal', 'Vest-Agder'),
(165, 'Hægebostad', 'Vest-Agder'),
(166, 'Kvinesdal', 'Vest-Agder'),
(167, 'Sirdal', 'Vest-Agder'),
(168, 'Eigersund', 'Rogaland'),
(169, 'Sandnes', 'Rogaland'),
(170, 'Stavanger', 'Rogaland'),
(171, 'Haugesund', 'Rogaland'),
(172, 'Sokndal', 'Rogaland'),
(173, 'Lund', 'Rogaland'),
(174, 'Bjerkreim', 'Rogaland'),
(175, 'Hå', 'Rogaland'),
(176, 'Klepp', 'Rogaland'),
(177, 'Time', 'Rogaland'),
(178, 'Gjesdal', 'Rogaland'),
(179, 'Sola', 'Rogaland'),
(180, 'Randaberg', 'Rogaland'),
(181, 'Forsand', 'Rogaland'),
(182, 'Strand', 'Rogaland'),
(183, 'Hjelmeland', 'Rogaland'),
(184, 'Suldal', 'Rogaland'),
(185, 'Sauda', 'Rogaland'),
(186, 'Finnøy', 'Rogaland'),
(187, 'Rennesøy', 'Rogaland'),
(188, 'Kvitsøy', 'Rogaland'),
(189, 'Bokn', 'Rogaland'),
(190, 'Tysvær', 'Rogaland'),
(191, 'Karmøy', 'Rogaland'),
(192, 'Utsira', 'Rogaland'),
(193, 'Vindafjord', 'Rogaland'),
(194, 'Bergen', 'Hordaland'),
(195, 'Etne', 'Hordaland'),
(196, 'Sveio', 'Hordaland'),
(197, 'Bømlo', 'Hordaland'),
(198, 'Stord', 'Hordaland'),
(199, 'Fitjar', 'Hordaland'),
(200, 'Tysnes', 'Hordaland'),
(201, 'Kvinnherad', 'Hordaland'),
(202, 'Jondal', 'Hordaland'),
(203, 'Odda', 'Hordaland'),
(204, 'Ullensvang', 'Hordaland'),
(205, 'Eidfjord', 'Hordaland'),
(206, 'Ulvik', 'Hordaland'),
(207, 'Granvin', 'Hordaland'),
(208, 'Voss', 'Hordaland'),
(209, 'Kvam', 'Hordaland'),
(210, 'Fusa', 'Hordaland'),
(211, 'Samnanger', 'Hordaland'),
(212, 'Os, Hordaland', 'Hordaland'),
(213, 'Austevoll', 'Hordaland'),
(214, 'Sund', 'Hordaland'),
(215, 'Fjell', 'Hordaland'),
(216, 'Askøy', 'Hordaland'),
(217, 'Vaksdal', 'Hordaland'),
(218, 'Modalen', 'Hordaland'),
(219, 'Osterøy', 'Hordaland'),
(220, 'Meland', 'Hordaland'),
(221, 'Øygarden', 'Hordaland'),
(222, 'Radøy', 'Hordaland'),
(223, 'Lindås', 'Hordaland'),
(224, 'Austrheim', 'Hordaland'),
(225, 'Fedje', 'Hordaland'),
(226, 'Masfjorden', 'Hordaland'),
(227, 'Flora', 'Sogn og Fjordane'),
(228, 'Gulen', 'Sogn og Fjordane'),
(229, 'Solund', 'Sogn og Fjordane'),
(230, 'Hyllestad', 'Sogn og Fjordane'),
(231, 'Høyanger', 'Sogn og Fjordane'),
(232, 'Vik', 'Sogn og Fjordane'),
(233, 'Balestrand', 'Sogn og Fjordane'),
(234, 'Leikanger', 'Sogn og Fjordane'),
(235, 'Sogndal', 'Sogn og Fjordane'),
(236, 'Aurland', 'Sogn og Fjordane'),
(237, 'Lærdal', 'Sogn og Fjordane'),
(238, 'Årdal', 'Sogn og Fjordane'),
(239, 'Luster', 'Sogn og Fjordane'),
(240, 'Askvoll', 'Sogn og Fjordane'),
(241, 'Fjaler', 'Sogn og Fjordane'),
(242, 'Gaular', 'Sogn og Fjordane'),
(243, 'Jølster', 'Sogn og Fjordane'),
(244, 'Førde', 'Sogn og Fjordane'),
(245, 'Naustdal', 'Sogn og Fjordane'),
(246, 'Bremanger', 'Sogn og Fjordane'),
(247, 'Vågsøy', 'Sogn og Fjordane'),
(248, 'Selje', 'Sogn og Fjordane'),
(249, 'Eid', 'Sogn og Fjordane'),
(250, 'Hornindal', 'Sogn og Fjordane'),
(251, 'Gloppen', 'Sogn og Fjordane'),
(252, 'Stryn', 'Sogn og Fjordane'),
(253, 'Molde', 'Møre og Romsdal'),
(254, 'Ålesund', 'Møre og Romsdal'),
(255, 'Kristiansund', 'Møre og Romsdal'),
(256, 'Vanylven', 'Møre og Romsdal'),
(257, 'Sande, Møre og Romdsal', 'Møre og Romsdal'),
(258, 'Herøy, Møre og Romsdal', 'Møre og Romsdal'),
(259, 'Ulstein', 'Møre og Romsdal'),
(260, 'Hareid', 'Møre og Romsdal'),
(261, 'Volda', 'Møre og Romsdal'),
(262, 'Ørsta', 'Møre og Romsdal'),
(263, 'Ørskog', 'Møre og Romsdal'),
(264, 'Norddal', 'Møre og Romsdal'),
(265, 'Stranda', 'Møre og Romsdal'),
(266, 'Stordal', 'Møre og Romsdal'),
(267, 'Sykkylven', 'Møre og Romsdal'),
(268, 'Skodje', 'Møre og Romsdal'),
(269, 'Sula', 'Møre og Romsdal'),
(270, 'Giske', 'Møre og Romsdal'),
(271, 'Haram', 'Møre og Romsdal'),
(272, 'Vestnes', 'Møre og Romsdal'),
(273, 'Rauma', 'Møre og Romsdal'),
(274, 'Nesset', 'Møre og Romsdal'),
(275, 'Midsund', 'Møre og Romsdal'),
(276, 'Sandøy', 'Møre og Romsdal'),
(277, 'Aukra', 'Møre og Romsdal'),
(278, 'Fræna', 'Møre og Romsdal'),
(279, 'Eide', 'Møre og Romsdal'),
(280, 'Averøy', 'Møre og Romsdal'),
(281, 'Gjemnes', 'Møre og Romsdal'),
(282, 'Tingvoll', 'Møre og Romsdal'),
(283, 'Sunndal', 'Møre og Romsdal'),
(284, 'Surnadal', 'Møre og Romsdal'),
(285, 'Rindal', 'Møre og Romsdal'),
(286, 'Halsa', 'Møre og Romsdal'),
(287, 'Smøla', 'Møre og Romsdal'),
(288, 'Aure', 'Møre og Romsdal'),
(289, 'Trondheim', 'Trøndelag'),
(290, 'Steinkjer', 'Trøndelag'),
(291, 'Namsos', 'Trøndelag'),
(292, 'Hemne', 'Trøndelag'),
(293, 'Snillfjord', 'Trøndelag'),
(294, 'Hitra', 'Trøndelag'),
(295, 'Frøya', 'Trøndelag'),
(296, 'Ørland', 'Trøndelag'),
(297, 'Agdenes', 'Trøndelag'),
(298, 'Bjugn', 'Trøndelag'),
(299, 'Åfjord', 'Trøndelag'),
(300, 'Roan', 'Trøndelag'),
(301, 'Osen', 'Trøndelag'),
(302, 'Oppdal', 'Trøndelag'),
(303, 'Rennebu', 'Trøndelag'),
(304, 'Meldal', 'Trøndelag'),
(305, 'Orkdal', 'Trøndelag'),
(306, 'Røros', 'Trøndelag'),
(307, 'Holtålen', 'Trøndelag'),
(308, 'Midtre Gauldal', 'Trøndelag'),
(309, 'Melhus', 'Trøndelag'),
(310, 'Skaun', 'Trøndelag'),
(311, 'Klæbu', 'Trøndelag'),
(312, 'Malvik', 'Trøndelag'),
(313, 'Selbu', 'Trøndelag'),
(314, 'Tydal', 'Trøndelag'),
(315, 'Meråker', 'Trøndelag'),
(316, 'Stjørdal', 'Trøndelag'),
(317, 'Frosta', 'Trøndelag'),
(318, 'Levanger', 'Trøndelag'),
(319, 'Verdal', 'Trøndelag'),
(320, 'Verran', 'Trøndelag'),
(321, 'Namdalseid', 'Trøndelag'),
(322, 'Snåsa', 'Trøndelag'),
(323, 'Lierne', 'Trøndelag'),
(324, 'Røyrvik', 'Trøndelag'),
(325, 'Namsskogan', 'Trøndelag'),
(326, 'Grong', 'Trøndelag'),
(327, 'Høylandet', 'Trøndelag'),
(328, 'Overhalla', 'Trøndelag'),
(329, 'Fosnes', 'Trøndelag'),
(330, 'Flatanger', 'Trøndelag'),
(331, 'Vikna', 'Trøndelag'),
(332, 'Nærøy', 'Trøndelag'),
(333, 'Leka', 'Trøndelag'),
(334, 'Inderøy', 'Trøndelag'),
(335, 'Indre Fosen', 'Trøndelag'),
(336, 'Bodø', 'Nordland'),
(337, 'Narvik', 'Nordland'),
(338, 'Bindal', 'Nordland'),
(339, 'Sømna', 'Nordland'),
(340, 'Brønnøy', 'Nordland'),
(341, 'Vega', 'Nordland'),
(342, 'Vevelstad', 'Nordland'),
(343, 'Herøy, Nordland', 'Nordland'),
(344, 'Alstahaug', 'Nordland'),
(345, 'Leirfjord', 'Nordland'),
(346, 'Vefsn', 'Nordland'),
(347, 'Grane', 'Nordland'),
(348, 'Hattfjelldal', 'Nordland'),
(349, 'Dønna', 'Nordland'),
(350, 'Nesna', 'Nordland'),
(351, 'Hemnes', 'Nordland'),
(352, 'Rana', 'Nordland'),
(353, 'Lurøy', 'Nordland'),
(354, 'Træna', 'Nordland'),
(355, 'Rødøy', 'Nordland'),
(356, 'Meløy', 'Nordland'),
(357, 'Gildeskål', 'Nordland'),
(358, 'Beiarn', 'Nordland'),
(359, 'Saltdal', 'Nordland'),
(360, 'Fauske', 'Nordland'),
(361, 'Sørfold', 'Nordland'),
(362, 'Steigen', 'Nordland'),
(363, 'Hamarøy', 'Nordland'),
(364, 'Tysfjord', 'Nordland'),
(365, 'Lødingen', 'Nordland'),
(366, 'Tjeldsund', 'Nordland'),
(367, 'Evenes', 'Nordland'),
(368, 'Ballangen', 'Nordland'),
(369, 'Røst', 'Nordland'),
(370, 'Værøy', 'Nordland'),
(371, 'Flakstad', 'Nordland'),
(372, 'Vestvågøy', 'Nordland'),
(373, 'Vågan', 'Nordland'),
(374, 'Hadsel', 'Nordland'),
(375, 'Bø, Nordland', 'Nordland'),
(376, 'Øksnes', 'Nordland'),
(377, 'Sortland', 'Nordland'),
(378, 'Andøy', 'Nordland'),
(379, 'Moskenes', 'Nordland'),
(380, 'Harstad', 'Troms'),
(381, 'Tromsø', 'Troms'),
(382, 'Kvæfjord', 'Troms'),
(383, 'Skånland', 'Troms'),
(384, 'Ibestad', 'Troms'),
(385, 'Gratangen', 'Troms'),
(386, 'Lavangen', 'Troms'),
(387, 'Bardu', 'Troms'),
(388, 'Salangen', 'Troms'),
(389, 'Målselv', 'Troms'),
(390, 'Sørreisa', 'Troms'),
(391, 'Dyrøy', 'Troms'),
(392, 'Tranøy', 'Troms'),
(393, 'Torsken', 'Troms'),
(394, 'Berg', 'Troms'),
(395, 'Lenvik', 'Troms'),
(396, 'Balsfjord', 'Troms'),
(397, 'Karlsøy', 'Troms'),
(398, 'Lyngen', 'Troms'),
(399, 'Storfjord', 'Troms'),
(400, 'Kåfjord', 'Troms'),
(401, 'Skjervøy', 'Troms'),
(402, 'Nordreisa', 'Troms'),
(403, 'Kvænangen', 'Troms'),
(404, 'Vardø', 'Finnmark'),
(405, 'Vadsø', 'Finnmark'),
(406, 'Hammerfest', 'Finnmark'),
(407, 'Kautokeino', 'Finnmark'),
(408, 'Alta', 'Finnmark'),
(409, 'Loppa', 'Finnmark'),
(410, 'Hasvik', 'Finnmark'),
(411, 'Kvalsund', 'Finnmark'),
(412, 'Måsøy', 'Finnmark'),
(413, 'Nordkapp', 'Finnmark'),
(414, 'Porsanger', 'Finnmark'),
(415, 'Karasjok', 'Finnmark'),
(416, 'Lebesby', 'Finnmark'),
(417, 'Gamvik', 'Finnmark'),
(418, 'Berlevåg', 'Finnmark'),
(419, 'Tana', 'Finnmark'),
(420, 'Nesseby', 'Finnmark'),
(421, 'Båtsfjord', 'Finnmark'),
(422, 'Sør-Varanger', 'Finnmark');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `oppdatering`
--

CREATE TABLE `oppdatering` (
  `feil_id` int(11) NOT NULL,
  `tid` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kommentar` text,
  `status_id` int(1) NOT NULL DEFAULT '1',
  `bruker_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `oppdatering`
--

INSERT INTO `oppdatering` (`feil_id`, `tid`, `kommentar`, `status_id`, `bruker_id`) VALUES
(1, '2019-01-16 10:36:13', 'Kommentar1', 1, 5),
(2, '2019-01-16 10:36:13', 'Kommentar2', 2, 5),
(2, '2019-01-18 15:50:22', 'ehdee', 3, 25),
(2, '2019-01-18 15:52:05', 'ferdig', 3, 25),
(2, '2019-01-18 16:00:39', 'deee', 3, 25),
(2, '2019-01-18 16:01:25', 'ddd', 3, 25),
(2, '2019-01-18 16:02:20', 'deee', 2, 25),
(2, '2019-01-19 13:33:04', 'ny kommentar', 3, 25),
(2, '2019-01-19 13:34:13', 'Dette er ein litt lengre kommentar enn dei andre som har vore tidligare', 3, 25),
(2, '2019-01-19 13:41:37', 'ferdig', 3, 25),
(2, '2019-01-19 14:58:19', 'deee', 3, 25),
(2, '2019-01-19 17:17:25', 'ferdg test', 3, 25),
(2, '2019-01-19 17:28:15', 'Bedriften har godtatt jobben', 3, 25),
(2, '2019-01-19 17:29:28', 'Bedrift godtok jobben og begynner arbeidet straks', 3, 25),
(2, '2019-01-19 17:36:35', 'Bedrift godtok jobben og begynner arbeidet straks', 3, 25),
(2, '2019-01-21 14:47:01', '', 3, 25),
(2, '2019-01-21 14:48:42', 'dee', 3, 25),
(3, '2019-01-16 10:36:13', 'Kommentar3', 2, 6),
(3, '2019-01-18 14:59:20', 'deee', 3, 25),
(3, '2019-01-18 15:48:21', 'test1', 3, 25),
(3, '2019-01-18 15:49:36', 'ny oppdatering', 3, 25),
(3, '2019-01-18 16:03:09', 'hbkm', 4, 25),
(4, '2019-01-16 10:36:13', 'Kommentar4', 3, 6),
(16, '2019-01-17 09:03:28', 'Sak opprettet', 1, NULL),
(17, '2019-01-17 10:22:11', 'Sak opprettet', 1, NULL),
(18, '2019-01-17 14:20:16', 'Sak opprettet', 1, NULL),
(19, '2019-01-17 14:23:53', 'Sak opprettet', 1, NULL),
(20, '2019-01-17 14:24:25', 'Sak opprettet', 1, NULL),
(21, '2019-01-17 16:24:36', 'Sak opprettet', 1, NULL),
(22, '2019-01-17 16:29:40', 'Sak opprettet', 1, NULL),
(23, '2019-01-18 08:27:58', 'Sak opprettet', 1, NULL),
(25, '2019-01-21 10:46:45', 'Sak opprettet', 1, NULL),
(26, '2019-01-18 08:37:45', 'Sak opprettet', 1, NULL),
(27, '2019-01-18 12:29:19', 'Sak opprettet', 1, NULL),
(28, '2019-01-21 09:34:31', 'Sak opprettet', 1, 16),
(29, '2019-01-21 09:37:18', 'Sak opprettet', 1, 16),
(30, '2019-01-21 09:41:01', 'Sak opprettet', 1, 16),
(31, '2019-01-21 09:50:11', 'Sak opprettet', 1, 16),
(32, '2019-01-21 10:08:53', 'Sak opprettet', 1, 16),
(33, '2019-01-21 10:13:13', 'Sak opprettet', 1, 16),
(34, '2019-01-22 08:43:41', 'Sak opprettet', 1, 31),
(35, '2019-01-22 09:02:26', 'Sak opprettet', 1, 31),
(36, '2019-01-22 09:46:59', 'Sak opprettet', 1, 32),
(37, '2019-01-22 10:28:42', 'Sak opprettet', 1, 31),
(38, '2019-01-22 10:29:02', 'Sak opprettet', 1, 16),
(39, '2019-01-22 10:31:02', 'Sak opprettet', 1, 16),
(40, '2019-01-22 10:32:32', 'Sak opprettet', 1, 16),
(41, '2019-01-22 12:39:51', 'Sak opprettet', 1, 16),
(42, '2019-01-22 12:41:13', 'Sak opprettet', 1, 16),
(43, '2019-01-22 12:57:36', 'Sak opprettet', 1, 20),
(44, '2019-01-22 14:10:48', 'Sak opprettet', 1, 16);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `privat`
--

CREATE TABLE `privat` (
  `bruker_id` int(11) NOT NULL,
  `fornavn` varchar(255) NOT NULL,
  `etternavn` varchar(255) NOT NULL,
  `sist_innlogget` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `privat`
--

INSERT INTO `privat` (`bruker_id`, `fornavn`, `etternavn`, `sist_innlogget`) VALUES
(1, 'ForPrivat1', 'EtterPrivat1', '2019-01-21 10:35:27'),
(2, 'ForPrivat2', 'EtterPrivat2', '2019-01-21 07:51:48'),
(3, 'ForPrivat3', 'EtterPrivat3', '2019-01-21 07:51:48'),
(4, 'ForPrivat4', 'EtterPrivat4', '2019-01-21 07:51:48'),
(13, 'Stian', 'Ådnanes', '2019-01-21 10:25:41'),
(14, 'Juni', 'Leirvik', '2019-01-21 07:51:48'),
(16, 'Bjørnar', 'Østtveit', '2019-01-22 14:12:05'),
(17, 'Stian', 'Ådnanes', '2019-01-22 11:45:28'),
(18, 'Sara', 'Hjelle', '2019-01-21 07:51:48'),
(20, 'Øivind', 'Larsson', '2019-01-22 16:29:04'),
(22, 'Anders', 'Iversen', '2019-01-21 07:51:48'),
(31, 'William', 'Andersson', '2019-01-22 13:57:44'),
(34, 'Rune', 'Vedøy', '2019-01-22 07:50:49');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `status`
--

CREATE TABLE `status` (
  `status_id` int(1) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `status`
--

INSERT INTO `status` (`status_id`, `status`) VALUES
(1, 'Ikke godkjent'),
(2, 'Godkjent'),
(3, 'Under behandling'),
(4, 'Ferdig');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `subkategori`
--

CREATE TABLE `subkategori` (
  `subkategori_id` int(11) NOT NULL,
  `kategorinavn` varchar(255) NOT NULL,
  `hovedkategori_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dataark for tabell `subkategori`
--

INSERT INTO `subkategori` (`subkategori_id`, `kategorinavn`, `hovedkategori_id`) VALUES
(1, 'Subkat1', 1),
(2, 'Subkat2', 1),
(3, 'Subkat3', 1),
(4, 'Subkat4', 2),
(5, 'Subkat5', 2),
(6, 'Subkat6', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`bruker_id`);

--
-- Indexes for table `ansatt`
--
ALTER TABLE `ansatt`
  ADD PRIMARY KEY (`bruker_id`);

--
-- Indexes for table `bedrift`
--
ALTER TABLE `bedrift`
  ADD PRIMARY KEY (`bruker_id`);

--
-- Indexes for table `bruker`
--
ALTER TABLE `bruker`
  ADD PRIMARY KEY (`bruker_id`),
  ADD KEY `kommune_id` (`kommune_id`);

--
-- Indexes for table `feil`
--
ALTER TABLE `feil`
  ADD PRIMARY KEY (`feil_id`),
  ADD KEY `kommune_id` (`kommune_id`),
  ADD KEY `bruker_id` (`bruker_id`),
  ADD KEY `subkategori_id` (`subkategori_id`);

--
-- Indexes for table `feilbilder`
--
ALTER TABLE `feilbilder`
  ADD PRIMARY KEY (`bilde_id`),
  ADD KEY `feilbilder_ibfk_1` (`feil_id`);

--
-- Indexes for table `feilfolg`
--
ALTER TABLE `feilfolg`
  ADD PRIMARY KEY (`feil_id`,`bruker_id`),
  ADD KEY `bruker_id` (`bruker_id`);

--
-- Indexes for table `fylker`
--
ALTER TABLE `fylker`
  ADD PRIMARY KEY (`fylke_navn`);

--
-- Indexes for table `hendelser`
--
ALTER TABLE `hendelser`
  ADD PRIMARY KEY (`hendelse_id`),
  ADD KEY `bruker_id` (`bruker_id`),
  ADD KEY `hendelseskategori_id` (`hendelseskategori_id`),
  ADD KEY `kommune_id` (`kommune_id`);

--
-- Indexes for table `hendelseskategori`
--
ALTER TABLE `hendelseskategori`
  ADD PRIMARY KEY (`hendelseskategori_id`);

--
-- Indexes for table `hendfolg`
--
ALTER TABLE `hendfolg`
  ADD PRIMARY KEY (`hendelse_id`,`bruker_id`),
  ADD KEY `bruker_id` (`bruker_id`);

--
-- Indexes for table `hovedkategori`
--
ALTER TABLE `hovedkategori`
  ADD PRIMARY KEY (`hovedkategori_id`);

--
-- Indexes for table `jobbSoknad`
--
ALTER TABLE `jobbSoknad`
  ADD PRIMARY KEY (`bruker_id`,`feil_id`),
  ADD KEY `feil_id` (`feil_id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `kommuner`
--
ALTER TABLE `kommuner`
  ADD PRIMARY KEY (`kommune_id`),
  ADD KEY `fylke_navn` (`fylke_navn`);

--
-- Indexes for table `oppdatering`
--
ALTER TABLE `oppdatering`
  ADD PRIMARY KEY (`feil_id`,`tid`),
  ADD KEY `bruker_id` (`bruker_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `privat`
--
ALTER TABLE `privat`
  ADD PRIMARY KEY (`bruker_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `subkategori`
--
ALTER TABLE `subkategori`
  ADD PRIMARY KEY (`subkategori_id`),
  ADD KEY `hovedkategori_id` (`hovedkategori_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bruker`
--
ALTER TABLE `bruker`
  MODIFY `bruker_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `feil`
--
ALTER TABLE `feil`
  MODIFY `feil_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `feilbilder`
--
ALTER TABLE `feilbilder`
  MODIFY `bilde_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `hendelser`
--
ALTER TABLE `hendelser`
  MODIFY `hendelse_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `hendelseskategori`
--
ALTER TABLE `hendelseskategori`
  MODIFY `hendelseskategori_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `hovedkategori`
--
ALTER TABLE `hovedkategori`
  MODIFY `hovedkategori_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kommuner`
--
ALTER TABLE `kommuner`
  MODIFY `kommune_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=423;

--
-- AUTO_INCREMENT for table `subkategori`
--
ALTER TABLE `subkategori`
  MODIFY `subkategori_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Begrensninger for dumpede tabeller
--

--
-- Begrensninger for tabell `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`);

--
-- Begrensninger for tabell `ansatt`
--
ALTER TABLE `ansatt`
  ADD CONSTRAINT `ansatt_ibfk_1` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`);

--
-- Begrensninger for tabell `bedrift`
--
ALTER TABLE `bedrift`
  ADD CONSTRAINT `bedrift_ibfk_1` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`);

--
-- Begrensninger for tabell `bruker`
--
ALTER TABLE `bruker`
  ADD CONSTRAINT `bruker_ibfk_1` FOREIGN KEY (`kommune_id`) REFERENCES `kommuner` (`kommune_id`);

--
-- Begrensninger for tabell `feil`
--
ALTER TABLE `feil`
  ADD CONSTRAINT `feil_ibfk_1` FOREIGN KEY (`kommune_id`) REFERENCES `kommuner` (`kommune_id`),
  ADD CONSTRAINT `feil_ibfk_2` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`),
  ADD CONSTRAINT `feil_ibfk_3` FOREIGN KEY (`subkategori_id`) REFERENCES `subkategori` (`subkategori_id`);

--
-- Begrensninger for tabell `feilbilder`
--
ALTER TABLE `feilbilder`
  ADD CONSTRAINT `feilbilder_ibfk_1` FOREIGN KEY (`feil_id`) REFERENCES `feil` (`feil_id`) ON DELETE CASCADE;

--
-- Begrensninger for tabell `feilfolg`
--
ALTER TABLE `feilfolg`
  ADD CONSTRAINT `feilfolg_ibfk_1` FOREIGN KEY (`feil_id`) REFERENCES `feil` (`feil_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feilfolg_ibfk_2` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`);

--
-- Begrensninger for tabell `hendelser`
--
ALTER TABLE `hendelser`
  ADD CONSTRAINT `hendelser_ibfk_1` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`),
  ADD CONSTRAINT `hendelser_ibfk_2` FOREIGN KEY (`hendelseskategori_id`) REFERENCES `hendelseskategori` (`hendelseskategori_id`),
  ADD CONSTRAINT `hendelser_ibfk_3` FOREIGN KEY (`kommune_id`) REFERENCES `kommuner` (`kommune_id`);

--
-- Begrensninger for tabell `hendfolg`
--
ALTER TABLE `hendfolg`
  ADD CONSTRAINT `hendfolg_ibfk_1` FOREIGN KEY (`hendelse_id`) REFERENCES `hendelser` (`hendelse_id`),
  ADD CONSTRAINT `hendfolg_ibfk_2` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`);

--
-- Begrensninger for tabell `jobbSoknad`
--
ALTER TABLE `jobbSoknad`
  ADD CONSTRAINT `jobbSoknad_ibfk_1` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`),
  ADD CONSTRAINT `jobbSoknad_ibfk_2` FOREIGN KEY (`feil_id`) REFERENCES `feil` (`feil_id`),
  ADD CONSTRAINT `jobbSoknad_ibfk_3` FOREIGN KEY (`status`) REFERENCES `status` (`status_id`);

--
-- Begrensninger for tabell `kommuner`
--
ALTER TABLE `kommuner`
  ADD CONSTRAINT `kommuner_ibfk_1` FOREIGN KEY (`fylke_navn`) REFERENCES `fylker` (`fylke_navn`);

--
-- Begrensninger for tabell `oppdatering`
--
ALTER TABLE `oppdatering`
  ADD CONSTRAINT `oppdatering_ibfk_1` FOREIGN KEY (`feil_id`) REFERENCES `feil` (`feil_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `oppdatering_ibfk_2` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`),
  ADD CONSTRAINT `oppdatering_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`);

--
-- Begrensninger for tabell `privat`
--
ALTER TABLE `privat`
  ADD CONSTRAINT `privat_ibfk_1` FOREIGN KEY (`bruker_id`) REFERENCES `bruker` (`bruker_id`);

--
-- Begrensninger for tabell `subkategori`
--
ALTER TABLE `subkategori`
  ADD CONSTRAINT `subkategori_ibfk_1` FOREIGN KEY (`hovedkategori_id`) REFERENCES `hovedkategori` (`hovedkategori_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
