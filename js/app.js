const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const eur = n => Number(n).toFixed(2).replace('.', ',') + ' €';
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} } };
let PRODUITS = store.get('catalogueCache', null) || CATALOGUE_DEFAUT;
let cart = store.get('panier', {}), order = null;
const ligne = k => { const i = k.indexOf('|'), p = PRODUITS.find(p => p.id === k.slice(0, i)), t = p && p.tailles.find(t => t.label === k.slice(i + 1)); return t && p.visible !== false && !p.epuise ? { p, t: t.label, prix: +t.prix } : null; };
const save = () => { store.set('panier', cart); renderCart(); };

/* --- Envoi par e-mail (FormSubmit) --- */
async function send(data) {
  const r = await fetch('https://formsubmit.co/ajax/' + EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ _template: 'table', _captcha: 'false', ...data }) });
  const j = await r.json().catch(() => ({})); if (!r.ok || String(j.success) === 'false') throw new Error(j.message || 'echec');
}
function handle(form, build, onOk) {
  form.addEventListener('submit', async e => {
    e.preventDefault(); const m = $('.msg', form), b = $('button[type=submit]', form);
    m.className = 'msg'; m.textContent = 'Envoi en cours…'; b.disabled = true;
    try { const p = build(Object.fromEntries(new FormData(form))); await send(p); m.classList.add('ok'); m.textContent = form.dataset.ok || 'Envoyé, merci !'; onOk && onOk(p); form.reset(); }
    catch { m.classList.add('err'); m.textContent = "L'envoi a échoué. Vérifiez votre connexion et réessayez."; }
    b.disabled = false;
  });
}

/* --- Header, footer, panier --- */
const pages = [['index.html', 'Accueil'], ['nos-patisseries.html', 'Nos pâtisseries'], ['apropos.html', 'À propos'], ['avis.html', 'Avis'], ['contact.html', 'Contact']];
const cur = location.pathname.split('/').pop() || 'index.html';
document.body.insertAdjacentHTML('afterbegin', `<header><div class="wrap"><a class="logo" href="index.html">Mllefeuillantine</a><nav>${pages.map(([h, t]) => `<a href="${h}" ${h === cur ? 'aria-current="page"' : ''}>${t}</a>`).join('')}<button class="cartbtn" id="open">Panier<span id="count">0</span></button></nav></div></header>`);
document.body.insertAdjacentHTML('beforeend', `<footer><div class="wrap"><div><div class="logo">Mllefeuillantine</div><p>Pâtisseries gourmandes et élégantes. Pâtisserie halal.</p></div><div><p>Instagram : <a href="https://instagram.com/${INSTA}" target="_blank" rel="noopener">@${INSTA}</a></p><p><a href="contact.html">Nous écrire</a> · <a href="conditions.html">Conditions et annulation</a></p></div></div></footer>
<div id="veil"></div><aside id="drawer" aria-label="Panier"><div class="dh"><h2>Votre panier</h2><button id="close" aria-label="Fermer">×</button></div><div class="db"><div id="lines"></div><div class="total"><span>Total</span><span id="total"></span></div><div id="done"></div>
<form id="order" class="form"><label>Nom<input name="nom" required autocomplete="name"></label><label>Téléphone<input name="telephone" type="tel" required autocomplete="tel"></label><label>E-mail (pour l'accusé de réception)<input name="email" type="email" required autocomplete="email"></label><label>Adresse de livraison<input name="adresse" required autocomplete="street-address"></label><label>Date souhaitée (72 h minimum)<input name="date" type="date" required></label><label>Précisions (facultatif)<textarea name="notes" rows="2"></textarea></label>
<fieldset class="pay"><legend>Paiement</legend><label class="radio"><input type="radio" name="paiement" value="carte" checked> Carte bancaire</label><label class="radio"><input type="radio" name="paiement" value="virement"> Virement bancaire</label></fieldset>
<div class="note small"><b>Annulation :</b> une fois la commande lancée en préparation, son annulation donne lieu à un remboursement partiel, déduction faite des matières premières déjà achetées pour votre commande. <a href="conditions.html">Détails</a></div>
<label class="radio"><input type="checkbox" name="cgv" required> J'ai lu et j'accepte les conditions d'annulation</label>
<button class="btn" type="submit">Envoyer ma commande</button><p class="msg" role="status"></p></form></div></aside>`);
const toggle = o => { $('#drawer').classList.toggle('open', o); $('#veil').classList.toggle('open', o); };
$('#open').onclick = () => toggle(true); $('#close').onclick = $('#veil').onclick = () => toggle(false);
document.addEventListener('keydown', e => e.key === 'Escape' && toggle(false));
$('#order [name=date]').min = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);

function renderCart() {
  const ks = Object.keys(cart).filter(k => cart[k] > 0 && ligne(k)); let total = 0, n = 0;
  $('#lines').innerHTML = ks.length ? ks.map(k => { const { p, t, prix } = ligne(k), q = cart[k]; total += prix * q; n += q;
    return `<div class="line"><span>${esc(p.nom)}<small>${esc(t)}</small></span><span class="qty"><button data-d="-1" data-id="${esc(k)}" aria-label="Retirer un">−</button>${q}<button data-d="1" data-id="${esc(k)}" aria-label="Ajouter un">+</button></span><b>${eur(prix * q)}</b></div>`; }).join('') : ($('#done').innerHTML ? '' : '<p class="sub">Votre panier est vide. Choisissez une pâtisserie et sa taille.</p>');
  $('#total').textContent = eur(total); $('#count').textContent = n; $('#order').style.display = ks.length ? '' : 'none'; $('.total').style.display = ks.length ? '' : 'none';
}
$('#lines').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cart[b.dataset.id] = Math.max(0, (cart[b.dataset.id] || 0) + +b.dataset.d); save(); });

const payInfo = o => {
  if (o.mode === 'carte') return PAYPAL_ME ? { h: `<p>Réglez <b>${eur(o.total)}</b> par carte bancaire :</p><a class="btn" target="_blank" rel="noopener" href="https://paypal.me/${PAYPAL_ME}/${o.total.toFixed(2)}EUR">Payer par carte</a><p class="small">Indiquez la référence ${o.ref}.</p>`, t: `Paiement par carte : https://paypal.me/${PAYPAL_ME}/${o.total.toFixed(2)}EUR` } : { h: '<p>Le lien de paiement par carte vous sera envoyé par e-mail.</p>', t: 'Le lien de paiement par carte vous sera envoyé par e-mail.' };
  return IBAN ? { h: `<p>Virement de <b>${eur(o.total)}</b> à :</p><p><b>${esc(IBAN_NOM)}</b><br>IBAN : ${esc(IBAN)}${BIC ? '<br>BIC : ' + esc(BIC) : ''}<br>Référence : ${o.ref}</p>`, t: `Virement de ${eur(o.total)} à ${IBAN_NOM}, IBAN ${IBAN}${BIC ? ', BIC ' + BIC : ''}, référence ${o.ref}.` } : { h: '<p>Les coordonnées bancaires vous seront envoyées par e-mail.</p>', t: 'Les coordonnées bancaires vous seront envoyées par e-mail.' };
};
handle($('#order'), f => {
  const { cgv, ...g } = f, ks = Object.keys(cart).filter(k => cart[k] > 0 && ligne(k));
  const lignes = ks.map(k => { const { p, t, prix } = ligne(k); return `${cart[k]} × ${p.nom} (${t}) : ${eur(prix * cart[k])}`; });
  const total = ks.reduce((s, k) => s + ligne(k).prix * cart[k], 0), ref = 'MF-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  order = { ref, total, mode: f.paiement, email: f.email, nom: f.nom }; const pi = payInfo(order);
  return { _subject: `Commande ${ref} – ${f.nom}`, _autoresponse: `Bonjour ${f.nom},\n\nNous avons bien reçu votre commande n° ${ref}. Elle a été transmise à Mllefeuillantine, qui vous contactera pour la confirmer.\n\nRécapitulatif :\n${lignes.join('\n')}\nTotal : ${eur(total)}\nLivraison souhaitée le ${f.date}\n\n${pi.t}\n\nRappel : une fois la commande lancée en préparation, une annulation donne lieu à un remboursement partiel (matières premières déjà achetées déduites).\n\nÀ très vite,\nMllefeuillantine`, ...g, reference: ref, commande: lignes.join(' | '), total: eur(total), paiement: f.paiement === 'carte' ? 'Carte bancaire' : 'Virement bancaire' };
}, () => {
  $('#done').innerHTML = `<div class="note"><h3>Commande ${order.ref} reçue ✓</h3><p>Votre commande a bien été transmise à la créatrice. Un e-mail d'accusé de réception vient d'être envoyé à <b>${esc(order.email)}</b> (pensez à vérifier vos courriers indésirables).</p>${payInfo(order).h}</div>`;
  cart = {}; save();
});
renderCart();

/* --- Catalogue --- */
const card = p => { const min = p.tailles.length ? Math.min(...p.tailles.map(t => +t.prix)) : null;
  return `<article class="card${p.epuise ? ' off' : ''}" data-id="${esc(p.id)}"><div class="ph">${p.offre ? '<span class="tag">Offre du moment</span>' : ''}${p.epuise ? '<span class="tag sold">Victime de son succès</span>' : ''}<img src="${esc(p.img)}" alt="${esc(p.nom)}" loading="lazy" onerror="this.remove()"></div><div class="body"><h3>${esc(p.nom)}</h3><p>${esc(p.desc)}</p>
<div class="sizes" role="group" aria-label="Choisir une taille">${p.tailles.map(t => `<button type="button" class="sz" aria-pressed="false" data-t="${esc(t.label)}" data-p="${t.prix}" ${p.epuise ? 'disabled' : ''}>${esc(t.label)}</button>`).join('')}</div>
<div class="foot"><span class="price">${p.epuise ? 'Momentanément épuisé' : min == null ? '' : 'À partir de ' + eur(min)}</span><button class="btn add" disabled>Ajouter</button></div></div></article>`; };
const grid = l => `<div class="grid">${l.map(card).join('')}</div>`;
function renderCatalogue() {
const vis = PRODUITS.filter(p => p.visible !== false), offres = vis.filter(p => p.offre);
const V = $('#vedette'); if (V) V.innerHTML = `<h2>${offres.length ? 'Offre du moment' : 'Nos coups de cœur'}</h2>` + grid((offres.length ? offres : vis).slice(0, 4));
const S = $('#sections');
if (S) { const cs = CATS.map(c => ({ ...c, l: vis.filter(p => p.cat === c.id) }));
  S.innerHTML = `<nav class="pills" aria-label="Catégories">${offres.length ? '<a href="#offre">Offre du moment</a>' : ''}${cs.map(c => `<a href="#${c.id}">${c.nom}</a>`).join('')}</nav>` +
    (offres.length ? `<section id="offre"><h2>Offre du moment</h2>${grid(offres)}</section>` : '') + cs.map(c => `<section id="${c.id}"><h2>${c.nom}</h2>${c.l.length ? grid(c.l) : '<p class="sub">De nouvelles créations arrivent bientôt.</p>'}</section>`).join(''); }
}
renderCatalogue();
import('./js/fb.js').then(async m => { const l = await m.fetchProduits(); if (l.length) { PRODUITS = l; store.set('catalogueCache', l); renderCatalogue(); renderCart(); } }).catch(() => {});
document.addEventListener('click', e => {
  const c = e.target.closest('.card'); if (!c) return; const p = PRODUITS.find(p => p.id === c.dataset.id), s = e.target.closest('.sz');
  if (s) { $$('.sz', c).forEach(x => { x.classList.remove('on'); x.setAttribute('aria-pressed', false); }); s.classList.add('on'); s.setAttribute('aria-pressed', true); c.dataset.sel = s.dataset.t; $('.price', c).innerHTML = `${esc(s.dataset.t)} : <b>${eur(s.dataset.p)}</b>`; $('.add', c).disabled = false; }
  else if (e.target.closest('.add') && c.dataset.sel) { const k = p.id + '|' + c.dataset.sel; cart[k] = (cart[k] || 0) + 1; $('#done').innerHTML = ''; save(); const b = e.target; b.textContent = 'Ajouté ✓'; setTimeout(() => b.textContent = 'Ajouter', 1200); }
});

/* --- Contact --- */
const cf = $('#contact-form'); if (cf) { cf.dataset.ok = 'Message envoyé, nous vous répondons vite.'; handle(cf, f => ({ _subject: 'Message de ' + f.nom, _autoresponse: `Bonjour ${f.nom}, nous avons bien reçu votre message et vous répondons rapidement. Mllefeuillantine`, ...f })); }

/* --- Avis --- */
const af = $('#avis-form');
if (af) {
  let note = 0; const st = $('#stars');
  st.innerHTML = [1, 2, 3, 4, 5].map(i => `<button type="button" data-n="${i}" role="radio" aria-checked="false" aria-label="${i} sur 5">★</button>`).join('');
  const paint = n => [...st.children].forEach((b, i) => { b.classList.toggle('on', i < n); b.setAttribute('aria-checked', i + 1 === n); });
  st.onclick = e => { const b = e.target.closest('button'); if (b) { note = +b.dataset.n; paint(note); } };
  const render = () => { const all = [...store.get('mesAvis', []), ...AVIS_PUBLICS];
    $('#moyenne').textContent = all.length ? `${(all.reduce((s, a) => s + a.note, 0) / all.length).toFixed(1).replace('.', ',')} / 5 · ${all.length} avis` : "Pas encore d'avis : soyez le premier à partager votre expérience.";
    $('#liste-avis').innerHTML = all.map(a => `<div class="avis"><span class="s">${'★'.repeat(a.note)}${'☆'.repeat(5 - a.note)}</span><b>${esc(a.nom)}</b>${a.commentaire ? `<p>${esc(a.commentaire)}</p>` : ''}</div>`).join(''); };
  render(); af.dataset.ok = 'Merci pour votre avis !';
  af.addEventListener('submit', e => { if (!note) { e.stopImmediatePropagation(); e.preventDefault(); const m = $('.msg', af); m.className = 'msg err'; m.textContent = 'Choisissez une note de 1 à 5 étoiles.'; } }, true);
  handle(af, f => ({ _subject: `Nouvel avis ${note}/5 – ${f.nom}`, ...f, note: note + '/5' }), () => { const a = store.get('mesAvis', []); a.unshift({ nom: af.nom.value, note, commentaire: af.commentaire.value.trim() }); store.set('mesAvis', a); note = 0; paint(0); render(); });
}
