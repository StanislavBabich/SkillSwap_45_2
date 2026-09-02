import style from './AboutPage.module.css';
import { Tag } from '@/shared/ui/Tag';

export const AboutPage = () => {
  
  return (
    <main className={style.content}>
        <h1 className={style.title}>The SkillSwap project — a skill-exchange platform</h1>
        <p className={style.text}>SkillSwap is a single-page (SPA) app where users publish two kinds of skills:</p>
        <ul className={style.ul}>
            <li>“Can teach” — skills the user is ready to share;</li>
            <li>“Want to learn” — skills the user wants to learn.</li>
        </ul>
        
        <h2 className={style.title}>Development team</h2>

        <section className={style.cards}>
          {/* Алишер */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?glassesProbability=100&mouth=variant10,variant11,variant13,variant15,variant16,variant17,variant19,variant21,variant22,variant23,variant25,variant26,variant27,variant28,variant29,variant30,variant12,variant18,variant20,variant24&seed=Easton)' }}
                 aria-label="Alisher's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Alisher</h3>
                 <div className={style.tags}>
                   <Tag variant="language">Kazakhstan</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>I'm a backend developer from Kazakhstan, working mainly with Java/PHP/TypeScript. In 2024 I finished the "Java Backend" course at Yandex Practicum. For about 1.5 years I've been working remotely as a backend developer for a European company. In my free time I make music, and sometimes I write my own songs using piano and electric guitar.</p>
          </div>  
          
          {/* Валентина */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?earrings=variant01,variant02,variant03,variant04&eyes=variant21,variant01&featuresProbability=0&glasses[]&glassesProbability=5&hair=long05,long11,short05&hairColor=0e0e0e,3eac2c,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&backgroundColor=ffdfbf&seed=Sarah)' }}
                 aria-label="Valentina's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Valentina</h3>
                 <div className={style.tags}>
                   <Tag variant="home">Saint Petersburg</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>I live in Saint Petersburg. I am a portal administrator and head of the IT department at the Russian Society of Cardiology (it sounds impressive; in practice I organize webinars, look after the website, and add features as needed). I love programming, organizing, and solving all kinds of problems. My big family is both my love and a many-sided hobby.</p>
          </div> 
          
          {/* Герман */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/lorelei/svg?seed=Brian)' }}
                 aria-label="German's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>German</h3>
                 <div className={style.tags}>
                   <Tag variant="health">Samara</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>I live in Samara. I work at a company that sells electrical products. Hobbies: singing, playing guitar and ukulele, and powerlifting.</p>
          </div>
          
          {/* Дарья */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?randomizeIds=true&earrings=variant06&earringsProbability=100&eyebrows=variant10&eyes=variant17&featuresProbability=0&glasses[]&glassesProbability=0&hair=long19&hairColor=6a4e35&mouth=variant02&skinColor=ecad80&seed=Eden)' }}
                 aria-label="Darya's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Darya</h3>
                 <div className={style.tags}>
                   <Tag variant="business">Moscow</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>I live in Moscow. I have worked as a biologist since 2014 at a former research institute, now part of FMBA. I decided to change careers and try programming. I love cross-stitching while watching movies, TV series, and anime, I tend to houseplants and an aquarium, and I try my hand at gardening at the dacha.</p>
          </div>
          
          {/* Денис */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?eyes=variant15,variant14,variant13,variant24&hair=short01&hairColor=0e0e0e&seed=Easton)' }}
                 aria-label="Denis's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Denis</h3>
                 <div className={style.tags}>
                   <Tag variant="art">Saint Petersburg</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>My name is Denis, I'm 22, originally from Novosibirsk, and I now live in Saint Petersburg. I work in product and design. In short, I develop internal EdTech at a leading gold-mining company. I combine this with studies at a railway university. Before that I worked at Foxford, Russian Railways, and VK.</p>
          </div> 
          
          {/* Иван */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?eyes=variant12&hair=short11,short08&hairColor=0e0e0e&mouth=variant02&seed=Jameson)' }}
                 aria-label="Ivan's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Ivan</h3>
                 <div className={style.tags}>
                   <Tag variant="language">Canada</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>My name is Ivan, I'm 33. I'm originally from Kazakhstan, then lived in Tula Oblast, and spent the last 12 years living and working in Sochi. I have a humanities degree, but I never worked in my field. In Sochi I worked in tourism — which makes sense for that city. I got to see the Olympics with my own eyes. I'm currently in Canada temporarily for work. In my free time I enjoy cycling, travel, and of course time spent with family.</p>
          </div>
          
          {/* Игнат */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?eyes=variant12&hair=short11,short08,short16&hairColor=0e0e0e,cb6820&mouth=variant02&seed=Christopher)' }}
                 aria-label="Ignat's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Ignat</h3>
                 <div className={style.tags}>
                   <Tag variant="home">Altai Krai</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>I'm 20. I was born and live in Rubtsovsk, Altai Krai. I'm a 4th-year student at an institute and plan to continue my higher education and work in IT.</p>
          </div>
          
          {/* Лидия */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?flip=true&earrings=variant01,variant02,variant03,variant04&eyebrows=variant12&eyes=variant05&featuresProbability=0&glasses[]&glassesProbability=5&hair=long10&hairColor=562306&mouth=variant12&backgroundColor=b6e3f4&seed=Jack)' }}
                 aria-label="Lidia's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Lidia</h3>
                 <div className={style.tags}>
                   <Tag variant="health">Vietnam</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>I'm from Nizhny Novgorod, but I haven't been there in over a year. I'm traveling now. I've visited more than 10 countries and I'm not stopping yet. We currently live in Vietnam. Everyone, including the kids, works remotely. I used to work as a sales manager, but I decided to learn a new field. So I'm starting programming from scratch. On the plus side, I cook really well: cakes, pastries, sourdough bread, pizza on biga, khinkali, and much more. Living abroad also taught me to make cottage cheese and ferment cabbage (fellow migrants will get it), and to live with kids 24/7 without kindergartens or schools.</p>
          </div>
          
          {/* Станислав */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?backgroundType[]&earrings[]&eyebrows=variant03&eyes=variant04&features[]&glasses[]&hair=long12&hairColor=afafaf&mouth=variant03&skinColor=f2d3b1&backgroundColor=transparent&seed=Adrian)' }}
                 aria-label="Stanislav's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Stanislav</h3>
                 <div className={style.tags}>
                   <Tag variant="business">Moscow</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>I live in Moscow. Over the past 10 years I've changed a lot of jobs, trying myself in different fields. I currently work as a top barber in a small barbershop chain. Hobbies: I play guitar and drums, read a lot, and work out.</p>
          </div> 
          
          {/* Юлия */}
          <div className={style.card}>
             <div className={style.metainfo}>
               <div 
                 className={style.avatar} 
                 style={{ backgroundImage: 'url(https://api.dicebear.com/9.x/adventurer/svg?eyebrows=variant13&eyes=variant19&features[]&glassesProbability=0&hair=long09&hairColor=0f0703&mouth=variant05&backgroundColor=a0a0a0&seed=Julia)' }}
                 aria-label="Yulia's avatar"
                 role="img"
               />
               <div>
                 <h3 className={style.name}>Yulia</h3>
                 <div className={style.tags}>
                   <Tag variant="home">Siberia</Tag>
                 </div>
               </div>
             </div>
             <p className={style.text}>A content manager from Siberia. In my free time I cross-stitch, try to learn cooking, practice yoga, and endlessly hunt for interesting new skincare products.</p>
          </div>
        </section>

    </main>
  );
};