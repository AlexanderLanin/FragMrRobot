/**
 This file is part of FragMrRobot.
 
 FragMrRobot is distributed under The Q Public License Version (QPL-1.0).
 
 You should have received a copy of the License along with this file.
 If not, see http://opensource.org/licenses/QPL-1.0
*/

var translations = {
  "armor": { "ru":"броня", "de":"Rüstung", "fr":"Armure", "es":"armadura", "pt":"Armadura"},
  "all_stats": { "ru":"ко всем статам", "de":"Alle Werte", "fr":"", "es":"", "pt":"Todos os status"},
  "intellect": { "ru":"интеллект", "de":"Intelligenz", "fr":"Intelligence", "es":"intelecto", "pt":"Intelecto", "it":"Intelletto"},
  "strength": { "ru":"сила", "de":"Stärke", "fr":"Force", "es":"fuerza", "pt":"Força"},
  "stamina": { "ru":"выносливость", "de":"Ausdauer", "fr":"Endurance", "es":"aguante", "pt":"Vigor", "it":"Tempra"},
  "spirit": { "ru":"дух", "de":"Willenskraft", "fr":"Esprit", "es":"espíritu", "pt":"Espírito"},
  "agility": { "ru":"ловкость", "de":"Beweglichkeit", "fr":"Agilité", "es":"agilidad", "pt":"Agilidade"},
  "short_intellect": { "ru":"инт.", "de":"Int.", "fr":"Int", "es":"int", "pt":"Int"},
  "short_strength": { "ru":"сила", "de":"Stärke", "fr":"Force", "es":"fuerza", "pt":"For"},
  "short_str": { "ru":"сила", "de":"Stärke", "fr":"Force", "es":"fuerza", "pt":"For"},
  "short_stamina": { "ru":"выносл.", "de":"Ausd.", "fr":"Endur", "es":"aguan", "pt":"Vig"},
  "short_spirit": { "ru":"дух", "de":"Will.", "fr":"Espr", "es":"esp", "pt":"Esp"},
  "short_agi": { "ru":"ловк.", "de":"Bewegl.", "fr":"Agil", "es":"agil", "pt":"Agi"},
  "attack_power": { "ru":"сила атаки", "de":"Angriffskraft", "fr":"puissance d’attaque", "es":"poder de ataque", "pt":"poder de ataque"},
  "crit": { "ru":"крит. удар", "de":"Krit.", "fr":"coup critique", "es":"golpe crítico", "pt":"acerto crítico"},
  "critical_strike": { "ru":"крит. удар", "de":"Krit.", "fr":"coup critique", "es":"golpe crítico", "pt":"acerto crítico"},
  "spell_crit": { "ru":"крит. удар заклинаний", "de":"Krit. (Zauber)", "fr":"coup critique", "es":"golpe crítico", "pt":"acerto crítico"},
  "dodge": { "ru":"уклонение", "de":"Ausweichen", "fr":"esquive", "es":"esquivar", "pt":"Esquiva"},
  "expertise": { "ru":"мастерство", "de":"Waffenkunde", "fr":"d'expertise", "es":"pericia", "pt":"aptidão"},
  "haste": { "ru":"скорость", "de":"Tempo", "fr":"hâte", "es":"celeridad", "pt":"aceleração"},
  "spell_haste": { "ru":"скор. заклинаний", "de":"Tempo (Zauber)", "fr":"hâte", "es":"celeridad", "pt":"aceleração"},
  "hit": { "ru":"меткость", "de":"Trefferwert", "fr":"toucher", "es":"golpe", "pt":"acerto"},
  "spell_hit": { "ru":"метк. заклинаний", "de":"Zaubertrefferw", "fr":"toucher", "es":"golpe", "pt":"acerto"},
  "mastery": { "ru":"искусность", "de":"Meisterschaft", "fr":"maîtrise", "es":"maestría", "pt":"maestria"},
  "parry": { "ru":"парирование", "de":"Parieren", "fr":"parade", "es":"parada", "pt":"Aparo"},
  "spell_power": { "ru":"Сила заклинаний", "de":"Zaubermacht", "fr":"puissance des sorts", "es":"poder con hechizos", "pt":"poder mágico"},
  "short_attack_power": { "ru":"атак.", "de":"Angriffsk", "fr":"attaque", "es":"ataq", "pt":"ataque"},
  "short_crit": { "ru":"крит", "de":"Krit", "fr":"crit", "es":"crít", "pt":"crít"},
  "short_dodge": { "ru":"уклон.", "de":"Ausw", "fr":"Esqui", "es":"esquiv", "pt":"Esquiva"},
  "short_exp": { "ru":"мастер.", "de":"Waff", "fr":"exp", "es":"peric", "pt":"aptidão"},
  "short_expertise": { "ru":"мастер.", "de":"Waff", "fr":"exp", "es":"peric", "pt":"aptidão"},
  "short_haste": { "ru":"скор.", "de":"Tempo", "fr":"hâte", "es":"cel", "pt":"acel"},
  "short_hit": { "ru":"метк.", "de":"Treffer", "fr":"touch", "es":"golpe", "pt":"acerto"},
  "short_mastery": { "ru":"искус.", "de":"Meist", "fr":"maît", "es":"maest", "pt":"maest"},
  "short_parry": { "ru":"парир.", "de":"Parier", "fr":"parade", "es":"par", "pt":"Aparo"},
  "short_spell_power": { "ru":"заклин.", "de":"Zaub", "fr":"sorts", "es":"hechi", "pt":"mágico"},
  "pvp_power": { "ru":"ПвП сила", "de":"PvP-Macht", "fr":"puissance JcJ", "es":"", "pt":"poder de jxj", "it":"Potenza PvP"},
  "pvp_resil": { "ru":"ПвП устойчивость", "de":"PvP-Abhärtung", "fr":"résilience JcJ", "es":"", "pt":"resiliência"},
  "honor_points": { "ru":"Очки чести", "de":"Ehrenpunkte", "fr":"Points d'honneur", "es":"Puntos de honor", "pt":"Pontos de Honra"},
  "justice_points": { "ru":"Очки справедливости", "de":"Gerechtigkeitspunkte", "fr":"Points de justice", "es":"Puntos de justicia", "pt":"Pontos de Justiça"},
  "valor_points": { "ru":"Очки доблести", "de":"Tapferkeitspunkte", "fr":"Points de vaillance", "es":"Puntos de valor", "pt":"Pontos de Bravura"},
  "conquest_points": { "ru":"Очки завоеваний", "de":"Eroberungspunkte", "fr":"Points de conquête", "es":"Puntos de conquista", "pt":"Pontos de Dominação"},
  "friendly": { "ru":"Дружелюбие", "de":"Freundlich", "fr":"", "es":"", "pt":"Respeitado"},
  "honored": { "ru":"Уважение", "de":"Wohlwollend", "fr":"Honoré", "es":"", "pt":"Honrado"},
  "revered": { "ru":"Почтение", "de":"Respektvoll", "fr":"", "es":"", "pt":"Reverenciado"},
  "exalted": { "ru":"Превознесение", "de":"Ehrfürchtig", "fr":"", "es":"", "pt":"Exaltado"},
  "food": { "ru":"Еда", "de":"Essen", "fr":"", "es":"", "pt":"Comida"},
  "flask": { "ru":"Настой", "de":"Trinken", "fr":"", "es":"", "pt":"Frasco"},
  "main_hand": { "ru":"", "de":"", "fr":"", "es":"", "pt":"Mão principal"},
  "off_hand": { "ru":"", "de":"", "fr":"", "es":"", "pt":"Mão secundária"},
  "head": { "ru":"", "de":"Helm", "fr":"", "es":"", "pt":"Cabeça"},
  "neck": { "ru":"", "de":"Hals", "fr":"", "es":"", "pt":"Pescoço"},
  "shoulder": { "ru":"", "de":"Schulter", "fr":"", "es":"", "pt":"Ombros"},
  "back": { "ru":"", "de":"Rücken", "fr":"", "es":"", "pt":"Costas"},
  "chest": { "ru":"", "de":"Brust", "fr":"", "es":"", "pt":"Torso"},
  "wrist": { "ru":"", "de":"Handgelenk", "fr":"", "es":"", "pt":"Pulsos"},
  "hands": { "ru":"", "de":"Hände", "fr":"", "es":"", "pt":"Mãos"},
  "waist": { "ru":"", "de":"Gürtel", "fr":"", "es":"", "pt":"Cintura"},
  "legs": { "ru":"", "de":"Beine", "fr":"", "es":"", "pt":"Pernas"},
  "feet": { "ru":"", "de":"Füße", "fr":"", "es":"", "pt":"Pés"},
  "ring_1": { "ru":"", "de":"Ring 1", "fr":"", "es":"", "pt":"Dedo 1"},
  "ring_2": { "ru":"", "de":"Ring 2", "fr":"", "es":"", "pt":"Dedo 2"},
  "trinket_1": { "ru":"", "de":"Schmuck 1", "fr":"", "es":"", "pt":"Berloque 1"},
  "trinket_2": { "ru":"", "de":"Schmuck 2", "fr":"", "es":"", "pt":"Berloque 2"},
  "belt_buckle": { "ru":"", "de":"Gürtelschnalle", "fr":"", "es":"", "pt":"Fivela"}
}
