package db

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/backend/internal/config"
)

type seedWord struct {
	transcription string
	translation   string
	symbols       string
}

type seedGroupDef struct {
	name  string
	words []seedWord
}

var numbers = []seedWord{
	{"yī", "one", "一"},
	{"èr", "two", "二"},
	{"sān", "three", "三"},
	{"sì", "four", "四"},
	{"wǔ", "five", "五"},
	{"liù", "six", "六"},
	{"qī", "seven", "七"},
	{"bā", "eight", "八"},
	{"jiǔ", "nine", "九"},
	{"shí", "ten", "十"},
}

var pronouns = []seedWord{
	{"wǒ", "I", "我"},
	{"nǐ", "you", "你"},
	{"tā", "he", "他"},
	{"tā", "she", "她"},
	{"wǒmen", "we", "我们"},
	{"nǐmen", "you (plural)", "你们"},
	{"tāmen", "they", "他们"},
}

var greetings = []seedWord{
	{"nǐ hǎo", "hello", "你好"},
	{"zǎo shang hǎo", "good morning", "早上好"},
	{"wǎn shang hǎo", "good evening", "晚上好"},
	{"zài jiàn", "goodbye", "再见"},
	{"xiè xie", "thank you", "谢谢"},
	{"bú kè qi", "you're welcome", "不客气"},
	{"duì bu qǐ", "sorry", "对不起"},
	{"méi guān xi", "it's okay / no problem", "没关系"},
	{"qǐng", "please", "请"},
	{"hěn gāo xìng rèn shi nǐ", "nice to meet you", "很高兴认识你"},
}

var family = []seedWord{
	{"jiā", "home / family", "家"},
	{"bà ba", "dad", "爸爸"},
	{"mā ma", "mom", "妈妈"},
	{"ér zi", "son", "儿子"},
	{"nǚ ér", "daughter", "女儿"},
	{"gē ge", "older brother", "哥哥"},
	{"dì di", "younger brother", "弟弟"},
	{"jiě jie", "older sister", "姐姐"},
	{"mèi mei", "younger sister", "妹妹"},
	{"yé ye", "grandpa (paternal)", "爷爷"},
	{"nǎi nai", "grandma (paternal)", "奶奶"},
	{"péng you", "friend", "朋友"},
}

var daysAndTime = []seedWord{
	{"jīn tiān", "today", "今天"},
	{"míng tiān", "tomorrow", "明天"},
	{"zuó tiān", "yesterday", "昨天"},
	{"xīng qī", "week", "星期"},
	{"xīng qī yī", "Monday", "星期一"},
	{"xīng qī èr", "Tuesday", "星期二"},
	{"xīng qī sān", "Wednesday", "星期三"},
	{"xīng qī sì", "Thursday", "星期四"},
	{"xīng qī wǔ", "Friday", "星期五"},
	{"xīng qī liù", "Saturday", "星期六"},
	{"xīng qī tiān", "Sunday", "星期天"},
	{"xiǎo shí", "hour", "小时"},
	{"fēn zhōng", "minute", "分钟"},
	{"xiàn zài", "now", "现在"},
	{"shí jiān", "time", "时间"},
}

var colors = []seedWord{
	{"hóng sè", "red", "红色"},
	{"lán sè", "blue", "蓝色"},
	{"lǜ sè", "green", "绿色"},
	{"huáng sè", "yellow", "黄色"},
	{"hēi sè", "black", "黑色"},
	{"bái sè", "white", "白色"},
	{"huī sè", "gray", "灰色"},
	{"fěn sè", "pink", "粉色"},
	{"zǐ sè", "purple", "紫色"},
	{"zōng sè", "brown", "棕色"},
}

var foodAndDrink = []seedWord{
	{"shuǐ", "water", "水"},
	{"chá", "tea", "茶"},
	{"kā fēi", "coffee", "咖啡"},
	{"mǐ fàn", "rice", "米饭"},
	{"miàn", "noodles", "面"},
	{"bāo zi", "steamed bun", "包子"},
	{"jī dàn", "egg", "鸡蛋"},
	{"ròu", "meat", "肉"},
	{"yú", "fish", "鱼"},
	{"shū cài", "vegetables", "蔬菜"},
	{"shuǐ guǒ", "fruit", "水果"},
	{"píng guǒ", "apple", "苹果"},
	{"miàn bāo", "bread", "面包"},
	{"niú nǎi", "milk", "牛奶"},
	{"chī", "to eat", "吃"},
	{"hē", "to drink", "喝"},
}

var places = []seedWord{
	{"zhè lǐ", "here", "这里"},
	{"nà lǐ", "there", "那里"},
	{"nǎ lǐ", "where", "哪里"},
	{"xué xiào", "school", "学校"},
	{"shāng diàn", "store", "商店"},
	{"cān guǎn", "restaurant", "餐馆"},
	{"yī yuàn", "hospital", "医院"},
	{"huǒ chē zhàn", "train station", "火车站"},
	{"jī chǎng", "airport", "机场"},
	{"gōng yuán", "park", "公园"},
	{"tú shū guǎn", "library", "图书馆"},
	{"cè suǒ", "toilet / restroom", "厕所"},
}

var commonVerbs = []seedWord{
	{"shì", "to be", "是"},
	{"yǒu", "to have", "有"},
	{"qù", "to go", "去"},
	{"lái", "to come", "来"},
	{"kàn", "to look / watch", "看"},
	{"tīng", "to listen", "听"},
	{"shuō", "to speak", "说"},
	{"dú", "to read", "读"},
	{"xiě", "to write", "写"},
	{"zuò", "to do / make", "做"},
	{"xiǎng", "to want / miss", "想"},
	{"xǐ huān", "to like", "喜欢"},
	{"zhī dào", "to know", "知道"},
	{"huì", "can / know how", "会"},
	{"néng", "can / be able", "能"},
}

// starterGroupsEN is the free newbie pack shown on the main screen (English template user).
var starterGroupsEN = []seedGroupDef{
	{"Numbers", numbers},
	{"Pronouns", pronouns},
	{"Greetings", greetings},
	{"Family", family},
	{"Days & Time", daysAndTime},
	{"Colors", colors},
	{"Food & Drink", foodAndDrink},
	{"Places", places},
	{"Common Verbs", commonVerbs},
}

var numbersRU = []seedWord{
	{"yī", "один", "一"},
	{"èr", "два", "二"},
	{"sān", "три", "三"},
	{"sì", "четыре", "四"},
	{"wǔ", "пять", "五"},
	{"liù", "шесть", "六"},
	{"qī", "семь", "七"},
	{"bā", "восемь", "八"},
	{"jiǔ", "девять", "九"},
	{"shí", "десять", "十"},
}

var pronounsRU = []seedWord{
	{"wǒ", "я", "我"},
	{"nǐ", "ты", "你"},
	{"tā", "он", "他"},
	{"tā", "она", "她"},
	{"wǒmen", "мы", "我们"},
	{"nǐmen", "вы", "你们"},
	{"tāmen", "они", "他们"},
}

var greetingsRU = []seedWord{
	{"nǐ hǎo", "привет", "你好"},
	{"zǎo shang hǎo", "доброе утро", "早上好"},
	{"wǎn shang hǎo", "добрый вечер", "晚上好"},
	{"zài jiàn", "до свидания", "再见"},
	{"xiè xie", "спасибо", "谢谢"},
	{"bú kè qi", "пожалуйста / не за что", "不客气"},
	{"duì bu qǐ", "извините", "对不起"},
	{"méi guān xi", "ничего страшного", "没关系"},
	{"qǐng", "пожалуйста", "请"},
	{"hěn gāo xìng rèn shi nǐ", "приятно познакомиться", "很高兴认识你"},
}

var familyRU = []seedWord{
	{"jiā", "дом / семья", "家"},
	{"bà ba", "папа", "爸爸"},
	{"mā ma", "мама", "妈妈"},
	{"ér zi", "сын", "儿子"},
	{"nǚ ér", "дочь", "女儿"},
	{"gē ge", "старший брат", "哥哥"},
	{"dì di", "младший брат", "弟弟"},
	{"jiě jie", "старшая сестра", "姐姐"},
	{"mèi mei", "младшая сестра", "妹妹"},
	{"yé ye", "дедушка", "爷爷"},
	{"nǎi nai", "бабушка", "奶奶"},
	{"péng you", "друг", "朋友"},
}

var daysAndTimeRU = []seedWord{
	{"jīn tiān", "сегодня", "今天"},
	{"míng tiān", "завтра", "明天"},
	{"zuó tiān", "вчера", "昨天"},
	{"xīng qī", "неделя", "星期"},
	{"xīng qī yī", "понедельник", "星期一"},
	{"xīng qī èr", "вторник", "星期二"},
	{"xīng qī sān", "среда", "星期三"},
	{"xīng qī sì", "четверг", "星期四"},
	{"xīng qī wǔ", "пятница", "星期五"},
	{"xīng qī liù", "суббота", "星期六"},
	{"xīng qī tiān", "воскресенье", "星期天"},
	{"xiǎo shí", "час", "小时"},
	{"fēn zhōng", "минута", "分钟"},
	{"xiàn zài", "сейчас", "现在"},
	{"shí jiān", "время", "时间"},
}

var colorsRU = []seedWord{
	{"hóng sè", "красный", "红色"},
	{"lán sè", "синий", "蓝色"},
	{"lǜ sè", "зелёный", "绿色"},
	{"huáng sè", "жёлтый", "黄色"},
	{"hēi sè", "чёрный", "黑色"},
	{"bái sè", "белый", "白色"},
	{"huī sè", "серый", "灰色"},
	{"fěn sè", "розовый", "粉色"},
	{"zǐ sè", "фиолетовый", "紫色"},
	{"zōng sè", "коричневый", "棕色"},
}

var foodAndDrinkRU = []seedWord{
	{"shuǐ", "вода", "水"},
	{"chá", "чай", "茶"},
	{"kā fēi", "кофе", "咖啡"},
	{"mǐ fàn", "рис", "米饭"},
	{"miàn", "лапша", "面"},
	{"bāo zi", "паровая булочка", "包子"},
	{"jī dàn", "яйцо", "鸡蛋"},
	{"ròu", "мясо", "肉"},
	{"yú", "рыба", "鱼"},
	{"shū cài", "овощи", "蔬菜"},
	{"shuǐ guǒ", "фрукты", "水果"},
	{"píng guǒ", "яблоко", "苹果"},
	{"miàn bāo", "хлеб", "面包"},
	{"niú nǎi", "молоко", "牛奶"},
	{"chī", "есть", "吃"},
	{"hē", "пить", "喝"},
}

var placesRU = []seedWord{
	{"zhè lǐ", "здесь", "这里"},
	{"nà lǐ", "там", "那里"},
	{"nǎ lǐ", "где", "哪里"},
	{"xué xiào", "школа", "学校"},
	{"shāng diàn", "магазин", "商店"},
	{"cān guǎn", "ресторан", "餐馆"},
	{"yī yuàn", "больница", "医院"},
	{"huǒ chē zhàn", "вокзал", "火车站"},
	{"jī chǎng", "аэропорт", "机场"},
	{"gōng yuán", "парк", "公园"},
	{"tú shū guǎn", "библиотека", "图书馆"},
	{"cè suǒ", "туалет", "厕所"},
}

var commonVerbsRU = []seedWord{
	{"shì", "быть", "是"},
	{"yǒu", "иметь", "有"},
	{"qù", "идти", "去"},
	{"lái", "приходить", "来"},
	{"kàn", "смотреть", "看"},
	{"tīng", "слушать", "听"},
	{"shuō", "говорить", "说"},
	{"dú", "читать", "读"},
	{"xiě", "писать", "写"},
	{"zuò", "делать", "做"},
	{"xiǎng", "хотеть / скучать", "想"},
	{"xǐ huān", "нравиться", "喜欢"},
	{"zhī dào", "знать", "知道"},
	{"huì", "уметь", "会"},
	{"néng", "мочь", "能"},
}

// starterGroupsRU is the Russian newbie pack (Russian template user).
var starterGroupsRU = []seedGroupDef{
	{"Числа", numbersRU},
	{"Местоимения", pronounsRU},
	{"Приветствия", greetingsRU},
	{"Семья", familyRU},
	{"Дни и время", daysAndTimeRU},
	{"Цвета", colorsRU},
	{"Еда и напитки", foodAndDrinkRU},
	{"Места", placesRU},
	{"Частые глаголы", commonVerbsRU},
}

// EnsureTemplateData creates or upgrades both locale template users and starter groups.
func EnsureTemplateData(ctx context.Context, pool *pgxpool.Pool, templateEmail string) error {
	enID, err := resolveTemplateUserID(ctx, pool, templateSpec{
		email:           templateEmail,
		providerSubject: config.TemplateProviderSubject,
		username:        "DemoUser",
		legacyUpgrade:   true,
	})
	if err != nil {
		return err
	}
	if err := ensureTemplateGroups(ctx, pool, enID, starterGroupsEN); err != nil {
		return err
	}

	ruID, err := resolveTemplateUserID(ctx, pool, templateSpec{
		email:           config.DefaultTemplateEmailRU,
		providerSubject: config.TemplateProviderSubjectRU,
		username:        "DemoUserRU",
		legacyUpgrade:   false,
	})
	if err != nil {
		return err
	}
	return ensureTemplateGroups(ctx, pool, ruID, starterGroupsRU)
}

type templateSpec struct {
	email           string
	providerSubject string
	username        string
	legacyUpgrade   bool
}

func resolveTemplateUserID(ctx context.Context, pool *pgxpool.Pool, spec templateSpec) (string, error) {
	var templateID string
	err := pool.QueryRow(ctx, `
		SELECT id FROM "User"
		WHERE provider = $1 AND provider_subject = $2
	`, config.TemplateProvider, spec.providerSubject).Scan(&templateID)
	if err == nil {
		return templateID, nil
	}
	if err != pgx.ErrNoRows {
		return "", err
	}

	if spec.legacyUpgrade {
		// Upgrade an existing local seed user if present (pre-SSO databases).
		err = pool.QueryRow(ctx, `
			SELECT id FROM "User"
			WHERE email = $1 OR username = 'DemoUser'
			ORDER BY CASE WHEN email = $1 THEN 0 ELSE 1 END
			LIMIT 1
		`, spec.email).Scan(&templateID)
		if err == nil {
			_, err = pool.Exec(ctx, `
				UPDATE "User"
				SET email = $2,
				    provider = $3,
				    provider_subject = $4,
				    password = NULL
				WHERE id = $1
			`, templateID, spec.email, config.TemplateProvider, spec.providerSubject)
			if err != nil {
				return "", err
			}
			return templateID, nil
		}
		if err != pgx.ErrNoRows {
			return "", err
		}
	}

	templateID = uuid.NewString()
	_, err = pool.Exec(ctx, `
		INSERT INTO "User" (id, username, email, password, provider, provider_subject, avatar_url)
		VALUES ($1, $2, $3, NULL, $4, $5, NULL)
	`, templateID, spec.username, spec.email, config.TemplateProvider, spec.providerSubject)
	if err != nil {
		return "", err
	}
	return templateID, nil
}

// ensureTemplateGroups adds any missing starter groups to the template user.
// Existing groups are left unchanged (idempotent by group name).
func ensureTemplateGroups(ctx context.Context, pool *pgxpool.Pool, templateID string, groups []seedGroupDef) error {
	existing, err := templateGroupNames(ctx, pool, templateID)
	if err != nil {
		return err
	}

	var missing []seedGroupDef
	for _, g := range groups {
		if _, ok := existing[g.name]; !ok {
			missing = append(missing, g)
		}
	}
	if len(missing) == 0 {
		return nil
	}

	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	for _, g := range missing {
		if err := seedGroup(ctx, tx, templateID, g.name, g.words); err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}

func templateGroupNames(ctx context.Context, pool *pgxpool.Pool, templateID string) (map[string]struct{}, error) {
	rows, err := pool.Query(ctx, `SELECT name FROM "Group" WHERE "userId" = $1`, templateID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	names := make(map[string]struct{})
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		names[name] = struct{}{}
	}
	return names, rows.Err()
}

func seedGroup(ctx context.Context, tx pgx.Tx, userID, name string, words []seedWord) error {
	groupID := uuid.NewString()
	_, err := tx.Exec(ctx, `
		INSERT INTO "Group" (id, name, "wordCount", "userId")
		VALUES ($1, $2, $3, $4)
	`, groupID, name, len(words), userID)
	if err != nil {
		return err
	}

	for _, w := range words {
		wordID := uuid.NewString()
		_, err = tx.Exec(ctx, `
			INSERT INTO "Word" (id, transcription, translation, symbols)
			VALUES ($1, $2, $3, $4)
		`, wordID, w.transcription, w.translation, w.symbols)
		if err != nil {
			return err
		}

		cardID := uuid.NewString()
		_, err = tx.Exec(ctx, `
			INSERT INTO "Card" (id, "groupId", "wordId", "updatedAt")
			VALUES ($1, $2, $3, NOW())
		`, cardID, groupID, wordID)
		if err != nil {
			return err
		}
	}

	return nil
}
