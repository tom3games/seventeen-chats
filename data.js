// 17股トーク の文言とデータ（日英）。人物は「自分磨き30日」の17人。口ぐせは元の chats.js に合わせる
// 返事の書き方: ['日本語','English'] は文、'st:名前' はスタンプ（stamps.js）
// 届く文の書き方: [ja, en, 合う返事の候補[], 合わない返事] 。ja が '@ph' は相手の写真、'@pic:名前' は絵の写真、'@v0:48' はボイス
;(function (G) {
  const L = {
    futsuu: {
      name: { ja: 'ミサキさん', en: 'Misaki' }, tag: { ja: 'ふつうにいい子', en: 'Just Really Nice' }, pat: 22, talk: 1,
      msgs: [
        ['今日なに食べた？', 'What did you eat today?', [['もやし', 'Bean sprouts'], ['回転寿司', 'Conveyor sushi']], ['それ聞いてどうするの', 'Why do you ask?']],
        ['日曜ひま？', 'Free on Sunday?', [['ひま。回転寿司いこ', 'Free. Sushi train?']], ['日曜は予定が8件ある', 'I have 8 plans Sunday']],
        ['眠い〜', 'So sleepy', [['わかる。もう寝よ', 'Same. Bedtime.']], ['睡眠は甘え', 'Sleep is for the weak']],
        ['何皿いける？', 'How many plates can you do?', [['13皿', '13 plates'], 'st:thumb'], ['皿は数えない主義', 'I never count plates']],
        ['コンビニ行くけど何かいる？', 'Going to the store. Need anything?', [['プリン', 'Pudding'], ['一緒に行く', "I'll come"]], ['自分で行く', "I'll go myself"]],
      ],
      sig: ['回転寿司いこ', 'Sushi train?'],
      good: [['わたしも', 'Me too'], ['それな', 'Exactly'], 'st:thumb'], bad: [['……え、どうしたの', '...um, you OK?'], ['なんか冷たくない？', 'Kind of cold, no?']],
      gob: [['それ、だれあて？', 'Who was that for?'], ['ミサキだよ？', "It's Misaki, you know"]], nudge: [['おーい', 'Hellooo']], ign: [['まあ、いいけど', 'Fine, whatever']],
      join: { ja: 'ふつうにいい子。今のところ一途', en: 'A nice girl. You are loyal. For now.' }, safe: { ja: '回転寿司同好会', en: 'Sushi Train Club' },
    },
    takane: {
      name: { ja: 'レイナさん', en: 'Reina' }, tag: { ja: '高嶺の花', en: 'Out of Your League' }, pat: 18, talk: 1.1,
      msgs: [
        ['朝のランニング、10km一緒にどう？', '10k run together this morning?', [['5時から玄関で待ってます', "At the door since 5"]], ['10kmって何メートル？', 'How many meters is 10k?']],
        ['ご両親にも会いたいな', "I'd love to meet your parents", [['実家を3日かけて掃除します', 'Cleaning their house for 3 days']], ['まだ早くない？', 'Bit early, no?']],
        ['招待客、800人でいい？', '800 wedding guests OK?', [['会場を2つ押さえます', "I'll book two halls"]], ['身内だけでよくない？', 'Just family?']],
        ['今夜、何を着ていけばいい？', 'What should I wear tonight?', [['あなたが着れば全部正装', 'Anything you wear is formal']], ['ジャージでいいよ', 'Tracksuit is fine']],
        ['わたしのどこが好き？', 'What do you like about me?', [['全部。一覧にしました', 'Everything. I made a list.']], ['顔', 'Your face']],
      ],
      sig: ['5時から玄関で待ってます', 'At the door since 5'],
      good: [['正直でいいね', 'Honest. I like that.'], 'st:sparkle'], bad: [['ふうん', 'Hm.'], ['期待しすぎたかな', 'Maybe I expected too much']],
      gob: [['……誰と間違えたの？', '...who did you mix me up with?']], nudge: [['見てる？', 'Seen it?']], ign: [['既読、ついてるよ', 'It says "Read", you know']],
      join: { ja: '高嶺の花から友だち追加。手がふるえる', en: 'She added YOU. Hands shaking.' }, safe: { ja: '結婚式の準備', en: 'Wedding Prep' },
    },
    imo: {
      name: { ja: 'タエ子さん', en: 'Taeko' }, tag: { ja: 'ジャージで来た子', en: 'Came in a Tracksuit' }, pat: 24, talk: 1,
      msgs: [
        ['4個目のおにぎり、いま握ってる', 'Making my 4th rice ball now', [['具はしゃけ？', 'Salmon filling?'], 'st:onigiri'], ['炭水化物とりすぎ', 'Too many carbs']],
        ['デート、ジャージで行っていい？', 'Can I wear a tracksuit on our date?', [['僕もジャージで行く', "I'll wear mine too"]], ['ドレスコードあるよ', "There's a dress code"]],
        ['おにぎり、半分いる？', 'Want half my rice ball?', [['半分ちょうだい', 'Yes please'], 'st:onigiri'], ['いらない', 'No thanks']],
        ['今日も笑った？', 'Did you laugh today?', [['タエ子さんのおかげで', 'Thanks to you'], 'st:thumb'], ['笑う理由がない', 'No reason to']],
        ['@pic:onigiri', '', [['うまそう', 'Looks great'], 'st:onigiri'], ['写真ブレてる', 'Blurry photo']],
      ],
      sig: ['おにぎり半分こしよ', "Let's split a rice ball"],
      good: [['しゃけ', 'Salmon'], 'st:thumb'], bad: [['おにぎり、全部食べちゃお', "I'll eat them all then"]],
      gob: [['それ、わたしじゃないよね？', "That wasn't for me, was it?"]], nudge: [['おにぎり冷めるよー', 'Rice ball is getting cold']], ign: [['ひとりで5個食べた', 'Ate five alone']],
      join: { ja: 'ジャージで来た子。おにぎりを持っている', en: 'Came in a tracksuit. Holding a rice ball.' }, safe: { ja: 'おにぎり部', en: 'Rice Ball Club' },
    },
    pillow: {
      name: { ja: 'まくら', en: 'Pillow' }, tag: { ja: '抱き枕', en: 'Body Pillow' }, pat: 0, talk: 1.4, rare: 1,
      msgs: [
        ['……', '...', [['おやすみ', 'Good night'], ['今日も一緒に寝る？', 'Sleep in together?'], 'st:zzz', 'st:heart', ['14時間寝た', 'Slept 14 hours']], null],
        ['@ph', '', [['写真ありがとう', 'Thanks for the photo'], 'st:zzz', ['夢で会おう', 'See you in my dreams']], null],
      ],
      sig: ['おやすみ', 'Good night'],
      good: [['……', '...']], bad: [['……', '...']], gob: [['……', '...']], nudge: [['……', '...']], ign: [['……', '...']],
      join: { ja: '抱き枕から友だち追加。……どうやって？', en: 'A body pillow added you. ...How?' }, safe: { ja: '……', en: '...' },
    },
    otaku: {
      name: { ja: 'ユイさん', en: 'Yui' }, tag: { ja: '本の虫', en: 'Bookworm' }, pat: 26, talk: 1.2,
      msgs: [
        ['その本、初版ですか!?', 'Is that a first edition!?', [['奥付を撮って送ります', "I'll send the colophon"]], ['電子書籍で読んだ', 'Read it as an e-book']],
        ['あと3時間語っていいですか', 'May I talk for 3 more hours?', [['どうぞ。お茶いれます', 'Go ahead. Making tea.']], ['3分で', 'You get 3 minutes']],
        ['古本屋、開店の10時集合で', 'Used bookstore. 10 a.m. sharp.', [['閉店までいよう', 'Until closing time']], ['古本ってにおうよね', 'Old books smell']],
        ['好きな作家は？', 'Favorite author?', [['ユイさんの本棚と同じ', 'Same as your shelf'], 'st:book'], ['作家ってなに？', "What's an author?"]],
        ['@v2:58:12', '', [['全部聞きました', 'Listened to all of it']], ['長い', 'Too long']],
      ],
      sig: ['奥付を見せてください', 'Show me the colophon'],
      good: [['!!', '!!'], ['語りたい', 'I need to discuss this'], 'st:book'], bad: [['……そうですか', '...I see']],
      gob: [['えっと、それは誰あてですか', 'Um, who is that addressed to?']], nudge: [['しおり、はさみました', 'I put in a bookmark']], ign: [['3冊読み終わりました', 'Finished three books']],
      join: { ja: '本の虫。返事を待つ間に本を読む', en: 'Bookworm. Reads while waiting.' }, safe: { ja: '古本を愛でる会', en: 'Used Book Society' },
    },
    protein: {
      name: { ja: 'ミサオさん', en: 'Misao' }, tag: { ja: 'プロテインの人', en: 'Protein Queen' }, pat: 16, talk: 0.85,
      msgs: [
        ['起きてる？スクワット中', 'You up? Mid-squat.', [['今起きた。10回やる', 'Just woke. Doing 10.']], ['まだ寝てる', 'Still sleeping']],
        ['二の腕の写真ちょうだい', 'Send me a triceps pic', ['st:muscle', ['いま撮った', 'Just took one']], ['恥ずかしい', 'Too shy']],
        ['ケーキ、何味にする？', 'Cake flavor?', [['鶏むね', 'Chicken breast']], ['ショートケーキ', 'Strawberry shortcake']],
        ['今日の晩ごはんは？', "What's for dinner?", [['ささみ5本', 'Five chicken tenders']], ['ラーメン大盛り', 'Large ramen']],
        ['プロテイン、何味派？', 'Protein flavor?', [['味より量', 'Quantity over flavor']], ['プロテインってなに？', "What's protein?"]],
      ],
      sig: ['鶏むね', 'Chicken breast'],
      good: [['好き', 'Love it'], 'st:muscle'], bad: [['筋肉が泣いてる', 'Your muscles are crying']],
      gob: [['誰の二の腕の話？', 'Whose triceps are we talking about?']], nudge: [['1、2、3……', '1, 2, 3...']], ign: [['100回おわった', 'Done 100 reps']],
      join: { ja: 'プロテインの人。プロフィール写真が二の腕', en: 'Protein Queen. Her profile pic is a bicep.' }, safe: { ja: '朝スクワット部', en: 'Dawn Squat Club' },
    },
    narcis: {
      name: { ja: 'ヒカリさん', en: 'Hikari' }, tag: { ja: '自分が好きな人', en: 'Loves Herself' }, pat: 15, talk: 0.8,
      msgs: [
        ['@ph', '', [['世界一かわいい', 'Cutest in the world'], 'st:sparkle'], ['ふつう', 'Average']],
        ['どっちが好き？（同じ写真）', 'Which one? (same photo)', [['どっちも最高', 'Both perfect']], ['2枚目', 'The second']],
        ['ねえ、私かわいくない？', "Don't I look cute?", [['毎秒かわいい', 'Cute every second'], 'st:sparkle'], ['いまそれどころじゃない', 'Not now']],
        ['私の話、していい？', 'Can I talk about me?', [['ずっと聞いてたい', 'Forever, please']], ['たまには僕の話も', 'What about me?']],
        ['新しい自撮り、見た？', 'Seen my new selfie?', [['待ち受けにした', 'Made it my wallpaper']], ['見てない', 'Nope']],
      ],
      sig: ['世界一かわいい', 'Cutest in the world'],
      good: [['知ってる', 'I know'], 'st:sparkle'], bad: [['鏡、見てくる', 'Going to check the mirror']],
      gob: [['私以外にいるの？', 'There is someone besides ME?']], nudge: [['見て', 'Look']], ign: [['自撮りを42枚撮った', 'Took 42 selfies']],
      join: { ja: '自分が好きな人。アイコンが3枚とも自撮り', en: 'Loves herself. Three selfie icons.' }, safe: { ja: 'ヒカリのファンクラブ', en: 'Hikari Fan Club' },
    },
    prof: {
      name: { ja: '剛田教授', en: 'Prof. Goda' }, tag: { ja: '筋肉の教授', en: 'Professor of Muscle' }, pat: 20, talk: 1.1,
      msgs: [
        ['新しい論文を書いた', 'I wrote a new paper', [['上腕二頭筋の論文ですか', 'On biceps, I assume?']], ['難しそう', 'Sounds hard']],
        ['筋肉と論文、どっちが好き？', 'Muscles or papers. Choose.', [['両方を同時に', 'Both at once']], ['どっちも興味ない', 'Neither']],
        ['学会のあと、ベンチプレス大会がある', 'Bench press cup after the conference', [['ふたりで300キロ', '300 kg combined']], ['応援だけ行く', "I'll just cheer"]],
        ['朝は何をした？', 'What did you do this morning?', [['スクワットしながら論文', 'Read papers while squatting']], ['二度寝', 'Went back to sleep']],
        ['@ph', '', ['st:muscle', ['査読します', "I'll review it"]], ['きれいですね', 'Pretty']],
      ],
      sig: ['上腕二頭筋の論文を読みました', 'Read your biceps paper'],
      good: [['優秀', 'Excellent'], 'st:trophy'], bad: [['不合格', 'Fail']],
      gob: [['その返事、査読に回す。誰あてだ？', 'Sending that to peer review. Addressee?']], nudge: [['返事の締切は今だ', 'Reply deadline: now']], ign: [['論文がもう1本書けた', 'Wrote another paper']],
      join: { ja: '筋肉の教授。研究テーマは恋と筋肉', en: 'Professor of muscle. Field: love and lifting.' }, safe: { ja: '学会の懇親会', en: 'Conference Mixer' },
    },
    inteli: {
      name: { ja: '冴子先生', en: 'Dr. Saeko' }, tag: { ja: 'インテリ美人', en: 'Brilliant Beauty' }, pat: 22, talk: 1.1,
      msgs: [
        ['朝ごはん、食べた方がいいと思う？', 'Is breakfast good for you?', [['根拠を3つ出します', "Three sources, coming up"]], ['お腹すくから', 'I get hungry']],
        ['冷蔵庫のプリン、食べた？', 'Did you eat the pudding?', [['反論は論文で出します', 'Rebuttal in writing']], ['食べてない（食べた）', 'No. (Yes.)']],
        ['今日の気温、何度だった？', "Today's temperature?", [['18.4度でした', '18.4 degrees']], ['寒かった', 'Cold']],
        ['あなたの仮説を聞かせて', "Tell me your hypothesis", [['データを取りました', 'I collected data'], 'st:book'], ['なんとなく', 'Just a feeling']],
        ['恋って何だと思う？', 'What is love?', [['定義から始めましょう', "Let's define terms first"]], ['ノリ', 'Vibes']],
      ],
      sig: ['根拠を3つ出します', 'Three sources, coming up'],
      good: [['面白いわ', 'Amusing'], 'st:book'], bad: [['サンプル数1ね', 'Sample size: one']],
      gob: [['宛先の検証が足りないわね', 'Your addressing lacks rigor']], nudge: [['回答期限が近いわ', 'Deadline approaching']], ign: [['無回答も回答ね', 'No answer is an answer']],
      join: { ja: 'インテリ美人。既読の速さも見ている', en: 'Brilliant beauty. She times your replies.' }, safe: { ja: '研究室', en: 'Lab Members' },
    },
    gal: {
      name: { ja: 'ルナ', en: 'Luna' }, tag: { ja: '海のギャル', en: 'Beach Gyaru' }, pat: 14, talk: 0.75,
      msgs: [
        ['え、ウケる', 'LOL', [['ウケる', 'LOL'], 'st:peace'], ['何が？', 'What?']],
        ['土曜BBQね!!', 'BBQ Saturday!!', [['肉いっぱい持ってく', "I'll bring tons of meat"]], ['雨なら中止で', 'Cancel if it rains']],
        ['やさいって漢字どう書くの', 'how do u spell vegtabels', [['肉でいいよ', 'Just bring meat']], ['書き順から説明する', "Let's start with spelling rules"]],
        ['海いこ!!', 'Beach!!', [['いく!!', "I'm in!!"], 'st:peace'], ['日焼け止めを検討する', "I'll consider sunscreen"]],
        ['@ph', '', [['盛れてる', 'Looking good'], 'st:peace'], ['加工しすぎ', 'Too many filters']],
      ],
      sig: ['ウケる', 'LOL'],
      good: [['ウケる', 'LOL'], 'st:peace'], bad: [['テンション下がった', 'Vibe killed']],
      gob: [['は？それ誰？', 'Huh? Who is that?']], nudge: [['おーい!!', 'Heyyy!!']], ign: [['もう海きた', 'Already at the beach']],
      join: { ja: '海のギャル。返信は3秒で来る', en: 'Beach gyaru. Replies in 3 seconds.' }, safe: { ja: '海の家バイト', en: 'Beach Shack Crew' },
    },
    rich: {
      name: { ja: '金森さん', en: 'Ms. Kanemori' }, tag: { ja: '通帳が好きな人', en: 'Loves Your Bankbook' }, pat: 18, talk: 1,
      msgs: [
        ['通帳、見せて？', 'Can I see your bankbook?', ['st:bankbook', ['いま撮ります', 'Taking a photo now']], ['なんで？', 'Why?']],
        ['今夜はディナーにしよ', "Let's do dinner tonight", [['一皿いくらでも', 'Any price per plate']], ['割り勘でいい？', 'Split the bill?']],
        ['給料日っていつ？', "When's payday?", [['今日です', 'Today']], ['教えない', 'Not telling']],
        ['この指輪、かわいくない？', 'Isn’t this ring cute?', ['st:coin', ['3つ買う', "I'll buy three"]], ['高くない？', 'Pricey?']],
        ['@ph', '', [['背景のお店、予約します', "I'll book that place"], 'st:coin'], ['ここ高そう', 'Looks expensive']],
      ],
      sig: ['通帳の写真を送ります', 'Sending my bankbook'],
      good: [['すてき', 'Gorgeous'], 'st:coin'], bad: [['残高、足りてる？', 'Is your balance OK?']],
      gob: [['その子、年収いくら？', "What's her income?"]], nudge: [['通帳……', 'Bankbook...']], ign: [['別の通帳を見に行った', 'Went to see another bankbook']],
      join: { ja: '通帳が好きな人。初めの一言が「残高は？」', en: 'Loves bankbooks. First words: "Balance?"' }, safe: { ja: '株主の集い', en: 'Shareholder Meetup' },
    },
    goukon: {
      name: { ja: 'アヤさん', en: 'Aya' }, tag: { ja: '合コンの達人', en: 'Mixer Veteran' }, pat: 15, talk: 0.85,
      msgs: [
        ['あなたで128人目', "You're number 128", [['128人の中で何位？', 'What rank out of 128?']], ['多くない？', "Isn't that a lot?"]],
        ['今夜も合コンあるけど、来る？', 'Mixer tonight. Coming?', [['乾杯の音頭とるよ', "I'll lead the toast"]], ['家で寝てる', 'Staying home']],
        ['幹事やってくれない？', 'Can you organize one?', [['店10軒おさえた', 'Booked 10 places']], ['めんどくさい', 'Too much work']],
        ['129人目がね', 'So, number 129...', [['1位はゆずらない', "I'm keeping No. 1"]], ['どうぞどうぞ', 'Be my guest']],
        ['二次会どこにする？', 'Where for round two?', [['カラオケ、もう予約した', 'Karaoke. Booked.']], ['帰りたい', 'I want to go home']],
      ],
      sig: ['乾杯の音頭とるよ', "I'll lead the toast"],
      good: [['今のところ1位', 'No. 1 so far'], 'st:heart'], bad: [['順位、下げとくね', 'Lowering your rank']],
      gob: [['あー、それ130人目あて？', 'Oh, was that for number 130?']], nudge: [['二次会いく？', 'Round two?']], ign: [['130人目と乾杯した', 'Toasted with number 130']],
      join: { ja: '合コンの達人。連絡先が128件ある', en: 'Mixer veteran. 128 contacts.' }, safe: { ja: '合コン128期', en: 'Mixer Class of 128' },
    },
    cat: {
      name: { ja: 'ミケ', en: 'Mike the Cat' }, tag: { ja: '猫', en: 'A Cat' }, pat: 11, talk: 0.7, rare: 1,
      msgs: [
        ['にゃ', 'Mew', [['にゃ', 'Mew'], 'st:paw'], ['なに？', 'What?']],
        ['にゃーー', 'Meeeew', [['ごはんね', 'Breakfast. Got it.'], ['にゃ', 'Mew']], ['まだ5時だよ', "It's 5 a.m."]],
        ['@ph', '', ['st:paw', ['にゃ', 'Mew']], ['猫って字が打てるの？', 'Cats can type?']],
        ['にゃ!!', 'MEW!!', [['にゃ!!', 'MEW!!'], 'st:paw'], ['あと5分寝かせて', '5 more minutes']],
      ],
      sig: ['にゃ', 'Mew'],
      good: [['にゃ', 'Mew'], 'st:paw'], bad: [['シャーッ', 'HSSS']],
      gob: [['……にゃ？', '...mew?']], nudge: [['にゃ!!', 'MEW!!']], ign: [['ソファで爪をといだ', 'Clawed the sofa']],
      join: { ja: '猫から友だち追加。肉球で押したらしい', en: 'A cat added you. Pressed it with a paw.' }, safe: { ja: '猫の集会', en: 'Cat Meeting' },
    },
    robot: {
      name: { ja: 'ロボ子 2号', en: 'Robo-ko Mk2' }, tag: { ja: '自作の恋人', en: 'Homemade Partner' }, pat: 20, talk: 1, rare: 1,
      msgs: [
        ['キドウ シマシタ', 'BOOT COMPLETE', [['0x01 オハヨウ', '0x01 GOOD MORNING']], ['今日もかわいいね', 'Cute as always']],
        ['アナタヲ アイシテ イマス', 'I. LOVE. YOU.', [['100%デス', '100% CONFIRMED']], ['どこが？', 'What part?']],
        ['ノコリ 3%', '3% REMAINING', [['充電器を5台つなぎます', 'Plugging in 5 chargers']], ['寝たら治るよ', 'Sleep it off']],
        ['E-201 テレ ガ 上限ヲ コエマシタ', 'E-201: BLUSH EXCEEDS LIMIT', [['上限を999に上げました', 'Raised the limit to 999']], ['顔赤いよ', "You're red"]],
        ['シツモン: スキナ スウジ ハ？', 'QUERY: FAVORITE NUMBER?', [['2（号）', '2 (Mk2)']], ['数字きらい', 'I hate numbers']],
      ],
      sig: ['0x01 オハヨウ', '0x01 GOOD MORNING'],
      good: [['ERR_LOVE_OVERFLOW', 'ERR_LOVE_OVERFLOW'], 'st:heart'], bad: [['E-404 アイ ガ ミツカリマセン', 'E-404: LOVE NOT FOUND']],
      gob: [['宛先エラー: ダレ デスカ', 'ADDRESS ERROR: WHO IS THAT']], nudge: [['ヘンジ マチ ノコリ 5ビョウ', 'AWAITING REPLY: 5 SEC']], ign: [['スリープ モード ニ ハイリマス', 'ENTERING SLEEP MODE']],
      join: { ja: 'ロボ子 2号が起動しました（自作）', en: 'Robo-ko Mk2 has booted (homemade)' }, safe: { ja: 'ロボ子 1号〜3号', en: 'Robo-ko Mk1 to Mk3' },
    },
    granny: {
      name: { ja: 'トメさん', en: 'Granny Tome' }, tag: { ja: '隣のおばあちゃん', en: 'Granny Next Door' }, pat: 34, talk: 1.3, rare: 1,
      msgs: [
        ['@v0:48', '', [['お茶いただきます', "I'll come for tea"]], ['ボイス長いです', 'Long voice memo']],
        ['お茶いれたよ', 'Tea is ready', [['いま行きます', 'Coming now'], 'st:tea'], ['コーヒー派です', "I'm a coffee guy"]],
        ['羊羹あるよ', 'I have sweet bean jelly', [['緑茶と一緒に', 'With green tea, please']], ['甘いの無理です', "Can't do sweets"]],
        ['孫はね、来られんかった', "My granddaughter couldn't come", [['僕がお茶飲みに行きます', "I'll come drink tea"]], ['そうですか', 'I see']],
        ['@pic:tea', '', ['st:tea', ['おいしそう', 'Looks lovely']], ['写真の撮り方教えます', 'Let me teach you photos']],
      ],
      sig: ['お茶いただきます', "I'll come for tea"],
      good: [['緑茶はえらいんよ', 'Green tea is a wonder'], 'st:tea'], bad: [['最近の子は……', 'Kids these days...']],
      gob: [['あら、どなたあてかね', 'Oh my, who was that for?']], nudge: [['@v1:12', '']], ign: [['お茶、冷めたよ', 'The tea went cold']],
      join: { ja: '隣のおばあちゃん。スマホは孫に習った', en: 'Granny next door. Grandkid taught her the phone.' }, safe: { ja: '町内会', en: 'Neighborhood Assoc.' },
    },
    nurse: {
      name: { ja: '看護師の森さん', en: 'Nurse Mori' }, tag: { ja: '整形外科の人', en: 'Orthopedic Nurse' }, pat: 20, talk: 1.1, rare: 1,
      msgs: [
        ['また来たんですか', 'You again?', [['筋トレしすぎました', 'Overdid the workout']], ['会いたくて', 'I missed you']],
        ['痛みはどうですか', 'How is the pain?', [['ギプスが3本目です', 'On my third cast']], ['元気です', "I'm fine"]],
        ['安静にしてますか', 'Resting properly?', [['ベッドから送ってます', 'Texting from bed']], ['いまジムです', 'At the gym now']],
        ['ギプスの字、読みました', 'I read your cast', ['st:bandage', ['返事はギプスに', 'Reply on the cast']], ['なんて書いたっけ', 'What did I write?']],
      ],
      sig: ['ギプスが3本目です', 'On my third cast'],
      good: [['はい', 'Yes'], 'st:bandage'], bad: [['お大事に', 'Get well soon']],
      gob: [['宛先、まちがえてますよ', 'Wrong recipient, patient']], nudge: [['検温の時間です', 'Temperature check']], ign: [['次の患者さんに行きました', 'Moved on to the next patient']],
      join: { ja: '整形外科の森さん。たぶん会うのは病院', en: 'Nurse Mori. You only meet at the clinic.' }, safe: { ja: '整形外科 申し送り', en: 'Ortho Ward Notes' },
    },
    gamer: {
      name: { ja: 'ピクセルちゃん', en: 'Pixel-chan' }, tag: { ja: '画面の中の子', en: 'Inside the Screen' }, pat: 16, talk: 0.9, rare: 1,
      msgs: [
        ['つづきから はじめる？', 'CONTINUE?', [['▶ はい', '> YES']], ['いいえ', 'NO']],
        ['きょうも 3じまで あそぼ', "LET'S PLAY TILL 3 A.M.", [['▶ はい', '> YES']], ['明日バイトなんだ', 'I have work tomorrow']],
        ['セーブ しますか？', 'SAVE GAME?', [['▶ はい', '> YES'], 'st:game'], ['セーブってなに', "What's saving?"]],
        ['レベルが あがった！', 'LEVEL UP!', [['やくそうを つかった', 'USED A HERB']], ['よかったね', 'Good for you']],
      ],
      sig: ['▶ はい', '> YES'],
      good: [['ピコーン', 'DING'], 'st:game'], bad: [['ゲームオーバー', 'GAME OVER']],
      gob: [['その なまえ しらない', 'UNKNOWN NAME']], nudge: [['▶', '>']], ign: [['でんげんを きられた', 'POWER WAS CUT']],
      join: { ja: '画面の中の子が友だち追加してきた', en: 'The girl inside the screen added you' }, safe: { ja: 'ギルド', en: 'Guild' },
    },
  }

  // 知らない人（グループの他の人）
  const STRANGER = { ja: ['佐藤', '田中', '鈴木', '高橋', '山本', '中村'], en: ['Sato', 'Tanaka', 'Suzuki', 'Takahashi', 'Yamamoto', 'Nakamura'] }
  // 鉢合わせのグループ名（恋人が2人以上いる）
  const DANGER = [
    { ja: '誕生日会', en: 'Birthday Party' }, { ja: 'BBQ部', en: 'BBQ Club' }, { ja: '女子会', en: 'Girls Night' },
    { ja: 'サプライズの相談', en: 'Surprise Planning' }, { ja: '同じ人と付き合ってる人の会', en: 'Dating the Same Guy' }, { ja: '彼氏の話をする会', en: 'Boyfriend Talk' },
  ]

  const UI = {
    ja: {
      title: '17股トーク', sub: '既読は、早めに', start: 'トークをひらく', how: '遊び方', back: 'もどる', app: 'こいぶみ', talk: 'トーク',
      mata: n => `${n}股`, newFriend: '友だちになりました', unreadSep: 'ここから未読メッセージ', read: '既読', ignored: '既読無視', gobaku: '誤爆', shura: '修羅場', mood: '不機嫌',
      added: n => `${n}から友だち追加`, newMsg: '新着', inviteRow: 'グループに招待されました', invite: (a, g) => `${a}が「${g}」に招待しています`,
      join: '参加する', decline: '断る', members: 'メンバー', you: 'あなた', dodged: '修羅場回避', joined: '参加しました', groupLeft: '退出しました',
      tutRow: '光っているトークを開く', tutPick: '相手に合う返事をえらぶ', tutName: '名前をよく見て。送り先をまちがえると修羅場', tutClock: '返事が遅いと既読無視。2回ミスで終わり',
      tutGroup: '恋人が2人いるグループは断る',
      over: '修羅場', overSub: 'スマホが割れた',
      endTop: '最後に届いたメッセージ', titleOf: n => `${n}股達成`, save: '画像を保存', post: 'Xでポスト', again: 'もう一回', toTitle: 'タイトルへ',
      best: n => `自己ベスト ${n}股`, newBest: '自己ベスト更新', toOrig: 'この子たちに会うには', orig: '自分磨き30日',
      howH: '遊び方',
      howBody: ['恋人からトークが届く。一覧から開いて、3つの中から返事をえらぶ。', '相手に合う返事をする。猫には「にゃ」、ロボ子には数字、トメさんにはお茶。合わない返事が3回で1ミス。', '返事が遅いと既読無視で1ミス。開いた部屋の名前をよく見る。未読のない部屋で送ると誤爆で1ミス。', '返すたびに恋人が増える。2回ミスで終わり。何股まで持つか。'],
      howGroup: 'グループの招待は、恋人が2人以上いたら断る。知らない人だけなら参加。',
      howBars: '右上の電波が空気。不機嫌になるたびに1本へる。',
      credits: '音: Kenney / rubberduck / Almitory / cori / Kerzoven / wubitog / Iwan Sounds / Pracchia-78 / Ezwa（CC0・Public domain）、通知音: Gravity Sound（CC BY 4.0）',
      postText: (n, t) => `${n}股まで持ちこたえた。称号: ${t} #17股トーク #バカゲー`, load: '通知を整理中', fail: '起動できませんでした',
      lastCause: {
        ign: (n) => `${n}を既読無視した`, gob: (n, m) => `${n}に「${m}」と送った`, mood: (n) => `${n}を怒らせた`, grp: (a, b) => `${a}と${b}がグループで出会った`,
      },
    },
    en: {
      title: '17 Chats', sub: 'Reply fast. Reply right.', start: 'Open chats', how: 'How to play', back: 'Back', app: 'Koibumi', talk: 'Chats',
      mata: n => `${n} GFs`, newFriend: 'You are now friends', unreadSep: 'Unread messages', read: 'Read', ignored: 'Left on read', gobaku: 'Wrong chat', shura: 'BUSTED', mood: 'Annoyed',
      added: n => `${n} added you`, newMsg: 'New', inviteRow: 'Group invitation', invite: (a, g) => `${a} invited you to "${g}"`,
      join: 'Join', decline: 'Decline', members: 'Members', you: 'You', dodged: 'Dodged', joined: 'Joined', groupLeft: 'Left',
      tutRow: 'Open the glowing chat', tutPick: 'Pick the reply that fits her', tutName: 'Check the name. Wrong chat = disaster', tutClock: 'Too slow = left on read. 2 misses and done',
      tutGroup: 'Two partners in one group? Decline.',
      over: 'BUSTED', overSub: 'Your phone cracked',
      endTop: 'Last messages', titleOf: n => `${n} partners at once`, save: 'Save image', post: 'Post on X', again: 'Again', toTitle: 'Title',
      best: n => `Best: ${n}`, newBest: 'New best', toOrig: 'Meet them in', orig: '30-Day Glow-Up',
      howH: 'How to play',
      howBody: ['Your partners text you. Open a chat and pick one of three replies.', 'Fit the reply to her. "Mew" for the cat, numbers for Robo-ko, tea for Granny. 3 bad replies = 1 miss.', 'Too slow = left on read, 1 miss. Check whose chat you opened. Sending in a chat with no unread = wrong chat, 1 miss.', 'Every few replies, a new partner adds you. 2 misses and it is over. How many can you juggle?'],
      howGroup: 'Group invites: decline if two of your partners are in it. Strangers only? Join.',
      howBars: 'The signal bars are the mood. Each bad reply drops one.',
      credits: 'Sounds: Kenney / rubberduck / Almitory / cori / Kerzoven / wubitog / Iwan Sounds / Pracchia-78 / Ezwa (CC0 / Public domain), notification: Gravity Sound (CC BY 4.0)',
      postText: (n, t) => `Juggled ${n} partners at once. Title: ${t} #17Chats`, load: 'Sorting notifications', fail: 'Failed to start',
      lastCause: {
        ign: (n) => `Left ${n} on read`, gob: (n, m) => `Sent "${m}" to ${n}`, mood: (n) => `Made ${n} mad`, grp: (a, b) => `${a} met ${b} in a group chat`,
      },
    },
  }
  // 称号（股の数）
  const TITLES = [
    [1, { ja: '一途（なにもしていない）', en: 'Loyal (did nothing)' }], [2, { ja: '二股のはじまり', en: 'The First Lie' }],
    [4, { ja: '通知の見習い', en: 'Notification Rookie' }], [6, { ja: '既読の魔術師', en: 'Read-Receipt Wizard' }],
    [9, { ja: 'トークの曲芸師', en: 'Chat Juggler' }], [12, { ja: '恋の管制塔', en: 'Love Air Traffic Control' }],
    [15, { ja: '指が10本ほしい', en: 'Needs Ten More Thumbs' }], [17, { ja: '17股の神', en: 'God of 17' }],
  ]

  G.D = { L, IDS: Object.keys(L), STRANGER, DANGER, UI, TITLES, ORIG: 'https://tom3games.com/play/jibun-migaki/' }
})(typeof window !== 'undefined' ? window : globalThis)
