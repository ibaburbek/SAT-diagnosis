import { LessonContent } from '../types';
import { QUESTION_BANK } from './questionBank';

export const LESSONS_DATA: LessonContent[] = [
  {
    id: 'lesson_linear_func',
    skillId: 'alg_linear_func',
    title: {
      en: 'Linear Functions, Slope & Rates of Change',
      kk: 'Сызықтық функциялар, көлбеу және өзгеру жылдамдығы',
      ru: 'Линейные функции, наклон и скорость изменения',
      id: 'Fungsi Linear, Gradien & Laju Perubahan',
    },
    summary: {
      en: 'Master slope as unit rate of change, y-intercept as starting value, and how to instantly recognize perpendicular and parallel slopes on the SAT.',
      kk: 'Көлбеуді бірлік өзгеру жылдамдығы, y-қиылысын бастапқы мән ретінде түсіну және параллель/перпендикуляр түзулерді жылдам табу.',
      ru: 'Освойте угловой коэффициент как единичную скорость изменения, y-пересечение как стартовое значение, а также параллельность и перпендикулярность.',
      id: 'Kuasai gradien sebagai laju perubahan per unit, intersep-y sebagai nilai awal, serta cara mengenali garis sejajar dan tegak lurus pada SAT.',
    },
    keyRules: [
      {
        rule: 'Slope-Intercept Form: y = mx + b',
        explanation: {
          en: 'm is the slope (change in y per 1 unit increase in x). b is the y-intercept (the value of y when x = 0).',
          kk: 'm — көлбеу коэффициенті (x 1 бірлікке артқандағы y-тің өзгерісі). b — бастапқы мән (x = 0 болғандағы y-тің мәні).',
          ru: 'm — наклон (изменение y на единицу изменения x). b — точка пересечения с осью Y (значение y при x = 0).',
          id: 'm adalah gradien (perubahan y untuk setiap kenaikan 1 satuan x). b adalah intersep-y (nilai y saat x = 0).',
        },
      },
      {
        rule: 'Perpendicular Lines: m₁ · m₂ = -1',
        explanation: {
          en: 'Take the negative reciprocal. If m = 2/3, the perpendicular slope is -3/2.',
          kk: 'Кері және қарама-қарсы таңбалы мәнді алыңыз. Егер m = 2/3 болса, перпендикуляр көлбеу -3/2 болады.',
          ru: 'Возьмите обратное число с противоположным знаком. Если m = 2/3, наклон перпендикуляра равен -3/2.',
          id: 'Gunakan kebalikan negatifnya. Jika m = 2/3, gradien tegak lurusnya adalah -3/2.',
        },
      },
    ],
    commonSATTraps: [
      {
        trap: 'Confusing the y-intercept with the slope in word problems',
        fix: {
          en: 'Look at the units! The slope always contains a compound rate ("dollars per month", "miles per hour"), while the intercept is a fixed one-time amount.',
          kk: 'Өлшем бірліктеріне қараңыз! Көлбеу әрқашан "сағатына", "айына" деген сөздермен келеді, ал y-қиылысы бір реттік сома.',
          ru: 'Смотрите на размерность! Наклон всегда содержит «в час», «за месяц», тогда как пересечение — это фиксированная сумма.',
          id: 'Perhatikan satuannya! Gradien selalu mengandung laju majemuk ("per jam", "per bulan"), sedangkan intersep adalah jumlah tetap satu kali.',
        },
      },
    ],
    interactiveType: 'linear',
    checkQuestions: QUESTION_BANK.filter(q => q.primarySkillId === 'alg_linear_func'),
  },
  {
    id: 'lesson_quadratics',
    skillId: 'adv_quadratics',
    title: {
      en: 'Quadratic Equations, Parabolas & Discriminant',
      kk: 'Квадрат теңдеулер, параболалар және дискриминант',
      ru: 'Квадратные уравнения, параболы и дискриминант',
      id: 'Persamaan Kuadrat, Parabola & Diskriminan',
    },
    summary: {
      en: 'Understand vertex form y = a(x - h)² + k, how the discriminant determines the number of real roots, and fast factoring tricks.',
      kk: 'Төбе формасы y = a(x - h)² + k, дискриминант арқылы нақты түбірлер санын табу және тиімді көбейткіштерге жіктеу әдістері.',
      ru: 'Разберитесь с формой вершины y = a(x - h)² + k, определением числа корней по дискриминанту и быстрым разложением.',
      id: 'Pahami bentuk puncak y = a(x - h)² + k, bagaimana diskriminan menentukan jumlah akar riil, dan trik faktorisasi cepat.',
    },
    keyRules: [
      {
        rule: 'Vertex Form: y = a(x - h)² + k',
        explanation: {
          en: 'The vertex is located at point (h, k). If a > 0, k is the minimum. If a < 0, k is the maximum.',
          kk: 'Төбесі (h, k) нүктесінде орналасқан. Егер a > 0 болса, k — минимум. Егер a < 0 болса, k — максимум.',
          ru: 'Вершина находится в точке (h, k). Если a > 0, k — минимум. Если a < 0, k — максимум.',
          id: 'Titik puncak berada pada koordinat (h, k). Jika a > 0, k adalah nilai minimum. Jika a < 0, k adalah maksimum.',
        },
      },
      {
        rule: 'Discriminant Rule: D = b² - 4ac',
        explanation: {
          en: 'D > 0: Two real solutions. D = 0: Exactly one real solution (tangent vertex). D < 0: No real solutions.',
          kk: 'D > 0: 2 нақты түбір. D = 0: Дәл 1 нақты түбір. D < 0: Нақты түбір жоқ.',
          ru: 'D > 0: два корня. D = 0: ровно один корень. D < 0: нет действительных корней.',
          id: 'D > 0: Dua solusi riil. D = 0: Tepat satu solusi riil. D < 0: Tidak ada solusi riil.',
        },
      },
    ],
    commonSATTraps: [
      {
        trap: 'Sign error when reading the h-coordinate from (x - h)²',
        fix: {
          en: 'Inside the parentheses the sign is negated! In y = (x - 4)², the vertex x-coordinate is +4, NOT -4.',
          kk: 'Жақша ішіндегі таңба қарама-қарсы ауысады! y = (x - 4)² болғанда, x = +4 болады, -4 емес.',
          ru: 'Знак внутри скобок противоположен! В y = (x - 4)² абсцисса вершины равна +4, а не -4.',
          id: 'Tanda di dalam kurung berlawanan! Pada y = (x - 4)², koordinat-x titik puncak adalah +4, BUKAN -4.',
        },
      },
    ],
    interactiveType: 'quadratic',
    checkQuestions: QUESTION_BANK.filter(q => q.primarySkillId === 'adv_quadratics'),
  },
  {
    id: 'lesson_percentages',
    skillId: 'ps_percentages',
    title: {
      en: 'Percentages, Multipliers & Percent Change',
      kk: 'Пайыздар, көбейту коэффициенттері және пайыздық өзгеріс',
      ru: 'Проценты, множители и процентное изменение',
      id: 'Persentase, Pengali & Perubahan Persen',
    },
    summary: {
      en: 'Never get tricked by consecutive percent changes. Learn to convert percentages directly into clean decimal multipliers.',
      kk: 'Тізбекті пайыздық өзгерістерде шатаспаңыз. Пайыздарды бірден ондық көбейту коэффициенттеріне айналдырып үйреніңіз.',
      ru: 'Не попадайтесь в ловушки последовательных изменений процентов. Научитесь работать с десятичными множителями.',
      id: 'Jangan terkecoh oleh perubahan persentase berturut-turut. Pelajari cara mengubah persentase langsung menjadi pengali desimal.',
    },
    keyRules: [
      {
        rule: 'Decimal Multiplier Method: Final = Initial × (1 ± r)',
        explanation: {
          en: 'A 20% increase is multiplying by 1.20. A 15% decrease is multiplying by 0.85.',
          kk: '20% өсім — 1.20-ге көбейту. 15% кему — 0.85-ке көбейту.',
          ru: 'Увеличение на 20% — это умножение на 1.20. Снижение на 15% — умножение на 0.85.',
          id: 'Kenaikan 20% berarti mengalikan dengan 1,20. Penurunan 15% berarti mengalikan dengan 0,85.',
        },
      },
      {
        rule: 'Percent Change Formula: [(New - Old) / Old] × 100%',
        explanation: {
          en: 'The denominator must ALWAYS be the original (starting) value, never the new one.',
          kk: 'Бөлімде ӘРҚАШАН бастапқы мән болуы керек, ешқашан жаңа мән емес.',
          ru: 'В знаменателе ВСЕГДА должно стоять исходное число, а не конечное.',
          id: 'Penyebut HARUS selalu nilai mula-mula (asli), bukan nilai baru.',
        },
      },
    ],
    commonSATTraps: [
      {
        trap: 'Assuming +20% and -20% cancel out to 0%',
        fix: {
          en: 'They apply to different bases! 100 × 1.20 = 120, and 120 × 0.80 = 96 (a net 4% decrease).',
          kk: 'Олар әртүрлі сандарға қолданылады! 100 × 1.20 = 120, ал 120 × 0.80 = 96 (жалпы 4% кему).',
          ru: 'Они применяются к разным базовым суммам! 100 × 1.20 = 120, а 120 × 0.80 = 96 (чистое снижение на 4%).',
          id: 'Keduanya diterapkan pada basis yang berbeda! 100 × 1,20 = 120, dan 120 × 0,80 = 96 (penurunan bersih 4%).',
        },
      },
    ],
    interactiveType: 'ratio',
    checkQuestions: QUESTION_BANK.filter(q => q.primarySkillId === 'ps_percentages'),
  },
  {
    id: 'lesson_circles',
    skillId: 'geo_circles',
    title: {
      en: 'Circle Equations, Completing the Square & Arcs',
      kk: 'Шеңбер теңдеуі, толық квадратқа келтіру және доғалар',
      ru: 'Уравнения окружностей, полный квадрат и дуги',
      id: 'Persamaan Lingkaran, Melengkapi Kuadrat & Busur',
    },
    summary: {
      en: 'Convert any general quadratic equation into (x - h)² + (y - k)² = r² effortlessly, and calculate arc lengths with confidence.',
      kk: 'Кез келген шеңбер теңдеуін оңай (x - h)² + (y - k)² = r² түріне келтіріп, доға ұзындығы мен сектор ауданын есептеу.',
      ru: 'Преобразуйте общее уравнение окружности в стандартный вид (x - h)² + (y - k)² = r² и легко находите длины дуг.',
      id: 'Ubah persamaan umum menjadi bentuk standar (x - h)² + (y - k)² = r² dengan mudah, dan hitung panjang busur.',
    },
    keyRules: [
      {
        rule: 'Standard Circle Form: (x - h)² + (y - k)² = r²',
        explanation: {
          en: 'Center is at (h, k) and radius is r (the square root of the constant on the right side).',
          kk: 'Центрі (h, k) нүктесінде, ал радиусы r (оң жақтағы санның квадрат түбірі).',
          ru: 'Центр в (h, k), а радиус равен r (квадратный корень из числа в правой части).',
          id: 'Pusat lingkaran di (h, k) dan jari-jari r (akar kuadrat dari konstanta di sisi kanan).',
        },
      },
      {
        rule: 'Completing the Square: (x + b/2)² - (b/2)²',
        explanation: {
          en: 'For x² + 6x, take half of 6 (= 3) and square it (= 9). Add 9 to both sides of the equation.',
          kk: 'x² + 6x үшін 6-ның жартысын (3) алып, квадратын (9) теңдеудің екі жағына қосамыз.',
          ru: 'Для x² + 6x возьмите половину 6 (= 3) и возведите в квадрат (= 9). Прибавьте 9 к обеим частям.',
          id: 'Untuk x² + 6x, ambil setengah dari 6 (= 3) lalu kuadratkan (= 9). Tambahkan 9 ke kedua ruas.',
        },
      },
    ],
    commonSATTraps: [
      {
        trap: 'Forgetting to take the square root of the right side to get the radius',
        fix: {
          en: 'If the equation ends in = 49, the radius is √49 = 7, NOT 49!',
          kk: 'Егер теңдеудің соңы = 49 болса, радиус 49 емес, √49 = 7 болады!',
          ru: 'Если справа стоит = 49, то радиус равен √49 = 7, а НЕ 49!',
          id: 'Jika persamaan diakhiri dengan = 49, jari-jarinya adalah √49 = 7, BUKAN 49!',
        },
      },
    ],
    interactiveType: 'circle',
    checkQuestions: QUESTION_BANK.filter(q => q.primarySkillId === 'geo_circles'),
  },
];
