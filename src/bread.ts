import { Discord, Command, CommandMessage } from '@typeit/discord'
import GoogleImages from 'google-images'

import storage from './storage'

const client = new GoogleImages('001163065415935235450:xhocipr0-5q', process.env.GOOGLE_CSE_KEY)
const EMOJI_URLS = [
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/bread_1f35e.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/241/bread_1f35e.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/bread_1f35e.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/whatsapp/238/bread_1f35e.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/259/bread_1f35e.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/facebook/230/bread_1f35e.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/joypixels/257/bread_1f35e.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/emojidex/112/bread_1f35e.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/facebook/65/bread_1f35e.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/baguette-bread_1f956.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/241/baguette-bread_1f956.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/baguette-bread_1f956.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/whatsapp/238/baguette-bread_1f956.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/259/baguette-bread_1f956.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/facebook/230/baguette-bread_1f956.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/joypixels/257/baguette-bread_1f956.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/croissant_1f950.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/241/croissant_1f950.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/croissant_1f950.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/whatsapp/238/croissant_1f950.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/259/croissant_1f950.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/facebook/230/croissant_1f950.png',
	'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/joypixels/257/croissant_1f950.png'
]


@Discord("!")
abstract class MuteDiscord {
	private async getRandomImage(query = '') {
		let day: number = await storage.getItem('day')
		let dailyCount: number = await storage.getItem('dailyCount')

		if (!day) {
			day = new Date().getDate()
			await storage.setItem('day', day)
		}

		if (dailyCount === undefined) {
			dailyCount = 0;
			await storage.setItem('dailyCount', dailyCount);
		}
		
		if (day !== new Date().getDate()) {
			day = new Date().getDate()
			dailyCount = 0;
			await storage.setItem('day', day)
			await storage.setItem('dailyCount', dailyCount)
		}

		let url: string;

		if (dailyCount < 100) {
			do {
				const page = Math.ceil(Math.random() * 50)
				const images = await client.search(query, { page })
				const index = Math.floor(Math.random() * images.length)
		
				url = images[index].url
				if (process.env.DEBUG === 'true') console.log(new Date().toLocaleTimeString(), '|', page, '|', index, '|', 'Bread baked from', url)
			} while (!url)
			dailyCount++;
			if (process.env.DEBUG === 'true') console.log(new Date().toLocaleTimeString(), '|', 'Daily Count Increased', '|', dailyCount)
			await storage.setItem('dailyCount', dailyCount)
		} else {
			url = EMOJI_URLS[Math.floor(Math.random() * EMOJI_URLS.length)]
		}

		return url
	}

	@Command("toast")
	private async toast(message: CommandMessage) {
		const url = await this.getRandomImage('toast')

		message.channel.send(`Here you go <@${message.author.id}>`, { embed: { image: { url } } })
	}

	@Command("bread")
	private async bread(message: CommandMessage) {
		const url = await this.getRandomImage('bread');

		message.channel.send(`Here you go <@${message.author.id}>`, { embed: { image: { url } } })
	}

	@Command("gfbread")
	private async glutenFreeBread(message: CommandMessage) {
		const url = await this.getRandomImage('gluten free bread');

		message.channel.send(`Here you go <@${message.author.id}>`, { embed: { image: { url } } })
	}

	@Command("🍞")
	private breadEmoji(message: CommandMessage) {
		return this.bread(message)
	}

	@Command("___super_secret_get_daily_count")
	private async getDailyCount(message: CommandMessage) {
		await message.reply(`the daily count is currently ${await storage.getItem('dailyCount')}`)
		await message.delete()
	}

	@Command("___super_secret_set_daily_count :count")
	private async setDailyCount(message: CommandMessage) {
		let num: number;
		try {
			num = parseInt(message.args.count)
		} catch {
			return;
		}

		await storage.setItem('dailyCount', num);
		await message.reply(`the daily count has been set to ${num}`)
		if (process.env.DEBUG === 'true') console.log(new Date().toLocaleTimeString(), '|', 'Daily Count Set To', '|', num)
		await message.delete()
	}
}