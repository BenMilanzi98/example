const axios = require('axios');
const cheerio = require('cheerio');

async function ArtiMimpi(mimpi) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.primbon.com/tafsir_mimpi.php?mimpi=${mimpi}&submit=+Submit+`)
      .then(({
        data 
      }) => {
        const $ = cheerio.load(data);
        const detect = $('#body > font > i').text();
        const isAva = /Tidak ditemukan/g.test(detect) ? false : true;
        if (isAva) {
          const isi = $('#body').text().split(`Hasil pencarian untuk kata kunci: ${mimpi}`)[1].replace(/\n\n\n\n\n\n\n\n\n/gi, '\n').replace(`Solution - Coping with the consequences of bad dream interpretation
      if you dream something that can be bad for you and your family
      (such as dreams of missing teeth etc.) you are expected to do things as
      the following to solve it:
      Take a broom stick (can also toothpicks, small bamboo, etc.). Then cut
      or break with your hands into 7 (seven) sticks, small,
      about 3 centimeters. Provide a piece of paper or tissue. Prepare
      table salt, just a little. Put the pieces of the seven broom sticks and salt
      the kitchen into a tissue or paper. Fold the paper and bury it
      into the ground (yard, yard). Sentences you must
      say it when going to bury / bury the paper (which contains 7 pieces of brooms
      sticks and salt) is a sentence that asks the Almighty
      The power to stay away from the bad consequences of your dreams.
      Example sentences: "Oh my God.. Keep me and my family away from
      catastrophe. Will not grow, this salt I bury. As
      just like my dream that can be bad for us won't come true
      reality or not. Amen.."








    
    `, '');
          const res = {
            status: 200,
            result: isi
          };
          resolve(res);
        } else {
          const res = {
            status: 404,
            result: `Dream Meaning ${mimpi} Not found`
          };
          resolve(res);
        }
      })
      .catch(reject);
  });
}

async function ArtiNama(nama) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.primbon.com/arti_nama.php?nama1=${nama}&proses=+Submit%21+`)
      .then(({
        data
      }) => {
        const $ = cheerio.load(data);
        const isi = $('#body').text().split('Nama:')[0];
        const res = {
            status: 200,
            result: isi
          };
          resolve(res);
      })
      .catch(reject);
  });
}

async function zodiakMinggu(querry) {
	const link = await axios.get(`https://www.fimela.com/zodiak/${querry}/minggu-ini`);
	const  $ = cheerio.load(link.data);
	let thumb = $('body > div > div > div').find('div > div > a > img').attr('src');
	let judul = $('body > div > div > div').find('div > div > div.zodiak--content-header__text > h5').text().trim();
	let date = $('body > div > div > div').find('div> div.zodiak--content-header__text > span').text().trim();
	let hoki = $('body > div > div > div > div').find('div > div > div:nth-child(1) > div > span').text().trim();
	let umum = $('body > div > div > div > div').find(' div > div > div:nth-child(1) > div > p').text().trim();
	let love = $('body > div > div > div > div').find(' div > div > div:nth-child(2) > div > p').text().trim();
	let keuangan = $('body > div > div > div > div').find(' div > div > div:nth-child(3) > div > p').text().trim();
	let rezeki = keuangan.replace('Couple', '\n\n- Couple').replace('Single', '- Single');
	const result = {
		status: link.status,
		data: {
			judul: judul,
			thumb: thumb,
			date: date,
			nomer_hoki: hoki,
			isi: {
				umum: umum,
				love: love,
				keuangan: rezeki
			}
		}
	};
	return result;
}

async function zodiakHari(querry) {
	let Hasil = [];
	await axios.request(`https://www.fimela.com/zodiak/${querry}`, {
			method: "GET",
			headers: {
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"accept-language": "en-US,en;q=0.9,id;q=0.8",
				"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
			}
		}).then(({ data}) => {
			const $ = cheerio.load(data);
			let thumb = $('body > div > div > div').find('div > div > a > img').attr('src');
			let judul = $('body > div > div.container-main > div.container-article > div').find('div.zodiak--content-header__right > div.zodiak--content-header__text > h5').text().trim();
			let tanggal = $('body > div > div > div > div > div > div > span').text().trim();
			let nomer_ = $('body > div > div > div > div > div > div').find('div:nth-child(1) > div.zodiak--content__content > span').text().trim();
				let umum = $('body > div > div > div > div > div > div').find('div:nth-child(1) > div.zodiak--content__content > p').text().trim() || undefined;
				let love = $('body > div > div > div > div > div > div').find('div:nth-child(2) > div.zodiak--content__content > p').text().trim() || undefined;
				let keuangan = $('body > div > div > div > div > div > div').find('div:nth-child(3) > div.zodiak--content__content > p').text().trim() || undefined;
				let rezeki = keuangan.replace('Couple', '\n\n- Couple').replace('Single', '- Single');
			const result = {
				judul: judul,
				thumb: thumb,
				date: tanggal,
				no_hoki: nomer_,
				isi: {
				  umum: umum,
				  love: love,
				  keuangan: rezeki
				}
			};
			Hasil.push(result);
		});
		return Hasil[0];
}

module.exports = {
  ArtiMimpi,
  ArtiNama,
  zodiakHari,
  zodiakMinggu
};
