import style from './AboutPage.module.css';
import { Tag } from '@/shared/ui/Tag';

export const AboutPage = () => {
  
  return (
    <main className={style.content}>
        <h1 className={style.title}>Проект «SkillSwap» — платформа обмена навыками</h1>
        <p className={style.text}>SkillSwap — одностраничное (SPA) приложение, в котором пользователи публикуют навыки двух типов:</p>
        <ul className={style.ul}>
            <li>«Учу» — навыки, которыми пользователь готов делиться;</li>
            <li>«Учусь» — навыки, которым пользователь хочет научиться.</li>
        </ul>
        
        <h2 className={style.title}>Команда разработчиков</h2>

        <section className={style.cards}>
          {/* Алишер */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?glassesProbability=100&mouth=variant10,variant11,variant13,variant15,variant16,variant17,variant19,variant21,variant22,variant23,variant25,variant26,variant27,variant28,variant29,variant30,variant12,variant18,variant20,variant24&seed=Easton)' }}
                 aria-label="Аватар Алишера"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Алишер</h3>
                 <div className={style.tags}>
                   <Tag variant="language">Казахстан</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Я бэкенд-разработчик из Казахстана, пишу в основном на Java/Php/Typescript. В 2024 году заканчивал курс "Java Backend" от яндекса практикума. И уже как 1.5 года работаю бэкенд-разработчиком удаленно на Европейскую компанию. Свободное время занимаюсь музыкой, иногда если будет желание пишу свои песни используя пианино и электрогитару</p>
          </div>  
          
          {/* Валентина */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?earrings=variant01,variant02,variant03,variant04&eyes=variant21,variant01&featuresProbability=0&glasses[]&glassesProbability=5&hair=long05,long11,short05&hairColor=0e0e0e,3eac2c,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&backgroundColor=ffdfbf&seed=Sarah)' }}
                 aria-label="Аватар Валентины"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Валентина</h3>
                 <div className={style.tags}>
                   <Tag variant="home">Санкт-Петербург</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Живу в Санкт-Петербурге. Являюсь администратором портала и начальником IT-отдела Российского кардиологического общества (звучит "круто", по факту просто организую вебинары, слежу за сайтом, делаю какие-то функционалы по надобности), обожаю программирование и организацию, решать всякие задачи. Моя большая семья - это моя любовь и одновременно разностороннее хобби ))</p>
          </div> 
          
          {/* Герман */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/lorelei/svg?seed=Brian)' }}
                 aria-label="Аватар Германа"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Герман</h3>
                 <div className={style.tags}>
                   <Tag variant="health">Самара</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Живу в Самаре. Работаю фирме, что реализует электротехнические товары. Из хобби - пою, играю на гитаре и укулеле,  занимаюсь силовым троеборьем)</p>
          </div>
          
          {/* Дарья */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?randomizeIds=true&earrings=variant06&earringsProbability=100&eyebrows=variant10&eyes=variant17&featuresProbability=0&glasses[]&glassesProbability=0&hair=long19&hairColor=6a4e35&mouth=variant02&skinColor=ecad80&seed=Eden)' }}
                 aria-label="Аватар Дарьи"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Дарья</h3>
                 <div className={style.tags}>
                   <Tag variant="business">Москва</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Живу в Москве. Работаю с 14-ого года в бывшем НИИ, сейчас ФМБА, на должности биолога. Решила сменить род деятель и попробовать себя в программировании. Люблю вышивать крестиком под кино/сериалы/аниме, вожусь с комнатными растениями, аквариумом, пытаюсь в цветоводстве на даче.</p>
          </div>
          
          {/* Денис */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?eyes=variant15,variant14,variant13,variant24&hair=short01&hairColor=0e0e0e&seed=Easton)' }}
                 aria-label="Аватар Дениса"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Денис</h3>
                 <div className={style.tags}>
                   <Tag variant="art">Санкт-Петербург</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Меня зовут Денис, мне 22, родом из Новосибирска, сейчас обитаю в Санкт-Петербурге. Работаю продуктом и дизом. Если кратко, то развиваю внутренний EdTech внутри лидирующей золотодобывающей компании) Все это совмещаю с учебной в ЖД университете. До этого успел поработать в фоксфорде, РЖД, ВК.</p>
          </div> 
          
          {/* Иван */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?eyes=variant12&hair=short11,short08&hairColor=0e0e0e&mouth=variant02&seed=Jameson)' }}
                 aria-label="Аватар Ивана"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Иван</h3>
                 <div className={style.tags}>
                   <Tag variant="language">Канада</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Меня зовут Иван, мне 33 года. Я родом из Казахстана, далее жил в Тульской области, но последние 12 лет проживал и работал в Сочи. У меня гуманитарное образование, однако по специальности я никогда не работал. В Сочи я был занят в сфере туризма — что вполне логично для этого города 😊. Мне довелось своими глазами увидеть Олимпиаду. Сейчас временно нахожусь в Канаде по работе. В свободное время увлекаюсь велоспортом, туризмом и, конечно же, ценю время, проведённое с семьёй.</p>
          </div>
          
          {/* Игнат */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?eyes=variant12&hair=short11,short08,short16&hairColor=0e0e0e,cb6820&mouth=variant02&seed=Christopher)' }}
                 aria-label="Аватар Игната"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Игнат</h3>
                 <div className={style.tags}>
                   <Tag variant="home">Алтайский край</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Мне 20 лет. Родился и живу в г. Рубцовск в Алтайском Крае. Учусь на 4 курсе в институте, планирую дальше получить высшее образование и работать в сфере IT.</p>
          </div>
          
          {/* Лидия */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?flip=true&earrings=variant01,variant02,variant03,variant04&eyebrows=variant12&eyes=variant05&featuresProbability=0&glasses[]&glassesProbability=5&hair=long10&hairColor=562306&mouth=variant12&backgroundColor=b6e3f4&seed=Jack)' }}
                 aria-label="Аватар Лидии"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Лидия</h3>
                 <div className={style.tags}>
                   <Tag variant="health">Вьетнам</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Я из Нижнего Новгорода, но уже больше года там не была. Сейчас путешествую. Посетила больше 10 стран и пока не собираюсь останавливаться. Сейчас живём во Вьетнаме. Все включая детей на удаленке)) Работала менеджером по продажам, но решила освоить новое для меня направление. Так что в программировании я с полного нуля). Зато отлично готовлю. Торты, выпечка, бездрожевой хлеб, пицца на биге, хинкали - всё это и многое другое. А ещё жизнь за рубежом научила делать творог и квасить капусту (мигранты меня поймут😂 ), а также уживаться с детьми 24/7 без садов и школ</p>
          </div>
          
          {/* Станислав */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?backgroundType[]&earrings[]&eyebrows=variant03&eyes=variant04&features[]&glasses[]&hair=long12&hairColor=afafaf&mouth=variant03&skinColor=f2d3b1&backgroundColor=transparent&seed=Adrian)' }}
                 aria-label="Аватар Станислава"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Станислав</h3>
                 <div className={style.tags}>
                   <Tag variant="business">Москва</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Я живу в Москве. За последние 10 лет сменил очень много профессий, пробуя себя в различных сферах. На данный момент работаю топ-мастером в небольшой сети барбершопов. Из хобби: играю на гитаре и барабанах, много читаю, занимаюсь спортом)</p>
          </div> 
          
          {/* Юлия */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?eyebrows=variant13&eyes=variant19&features[]&glassesProbability=0&hair=long09&hairColor=0f0703&mouth=variant05&backgroundColor=a0a0a0&seed=Julia)' }}
                 aria-label="Аватар Юлии"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Юлия</h3>
                 <div className={style.tags}>
                   <Tag variant="home">Сибирь</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>Контент-менеджер из Сибири. В свободное время вышиваю крестиком, пытаюсь учиться готовить, занимаюсь йогой и бесконечным поиском интересных новинок в уходовой косметике)</p>
          </div>
        </section>

    </main>
  );
};