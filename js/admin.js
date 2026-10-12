import * as fb from './fb.js';
const $ = (s, r = document) => r.querySelector(s), esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let data = [], idx = -1; const f = $('#ed');
const err = e => alert(e.code === 'permission-denied' ? "Accès refusé : ce compte n'est pas autorisé à modifier le catalogue." : 'Erreur : ' + (e.message || e));
const cn = id => (CATS.find(c => c.id === id) || {}).nom || id;
async function load() { data = await fb.fetchProduits(); list(); $('#seed').hidden = data.length > 0; }
fb.watch(u => { $('#login').hidden = !!u; $('#app').hidden = !u; if (u) { $('#who').textContent = u.email; load().catch(err); } });
$('#login').onsubmit = async e => { e.preventDefault(); $('#lerr').textContent = ''; try { await fb.login($('#em').value, $('#pw').value); } catch { $('#lerr').textContent = 'Identifiants incorrects.'; } };
$('#out').onclick = () => fb.logout();
$('#seed').onclick = async () => { try { for (const [i, p] of CATALOGUE_DEFAUT.entries()) await fb.saveProduit({ ...p, ordre: i }); await load(); } catch (e) { err(e); } };
function list() {
  $('#tb').innerHTML = '<tr><th>Pâtisserie</th><th>Catégorie</th><th>Tailles</th><th>Afficher</th><th>Épuisé</th><th>Offre</th><th></th></tr>' + data.map((p, i) => `<tr><td><b>${esc(p.nom)}</b></td><td>${esc(cn(p.cat))}</td><td>${p.tailles.map(t => esc(t.label) + ' ' + t.prix + '€').join(', ')}</td>${['visible', 'epuise', 'offre'].map(k => `<td><input type="checkbox" data-i="${i}" data-k="${k}" ${p[k] ? 'checked' : ''} aria-label="${k}"></td>`).join('')}<td><button class="btn sm" data-ed="${i}">Modifier</button> <button class="btn sm ghost" data-del="${i}">Supprimer</button></td></tr>`).join('');
}
$('#tb').onclick = async e => { const b = e.target; if (b.dataset.ed != null) edit(+b.dataset.ed); if (b.dataset.del != null && confirm('Supprimer « ' + data[b.dataset.del].nom + ' » ?')) { try { await fb.removeProduit(data[b.dataset.del].id); await load(); } catch (x) { err(x); } } };
$('#tb').onchange = async e => { const c = e.target; if (!c.dataset.k) return; const p = data[c.dataset.i]; p[c.dataset.k] = c.checked; try { await fb.saveProduit(p); } catch (x) { err(x); load(); } };
f.cat.innerHTML = CATS.map(c => `<option value="${c.id}">${c.nom}</option>`).join('');
function edit(i) { idx = i; const p = i < 0 ? { nom: '', desc: '', cat: CATS[0].id, img: '', tailles: [], visible: true } : data[i]; f.hidden = false; $('#et').textContent = i < 0 ? 'Nouvelle pâtisserie' : 'Modifier ' + p.nom;
  f.nom.value = p.nom; f.desc.value = p.desc; f.cat.value = p.cat; f.img.value = p.img; f.tailles.value = p.tailles.map(t => t.label + ' ; ' + t.prix).join('\n'); ['visible', 'epuise', 'offre'].forEach(k => f[k].checked = !!p[k]); f.scrollIntoView(); }
$('#new').onclick = () => edit(-1); $('#cx').onclick = () => f.hidden = true;
$('#file').onchange = e => { const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 800 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); f.img.value = c.toDataURL('image/jpeg', .75); }; im.src = r.result; }; r.readAsDataURL(e.target.files[0]); };
f.onsubmit = async e => { e.preventDefault();
  const tailles = f.tailles.value.split('\n').map(l => l.split(';')).filter(a => a[0].trim()).map(a => ({ label: a[0].trim(), prix: parseFloat(String(a[1] || '').replace(',', '.')) || 0 }));
  const p = { id: idx < 0 ? (f.nom.value.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'p') + '-' + Date.now().toString(36) : data[idx].id, nom: f.nom.value.trim(), desc: f.desc.value.trim(), cat: f.cat.value, img: f.img.value.trim(), tailles, visible: f.visible.checked, epuise: f.epuise.checked, offre: f.offre.checked, ordre: idx < 0 ? Math.max(-1, ...data.map(d => d.ordre ?? 0)) + 1 : (data[idx].ordre ?? idx) };
  try { await fb.saveProduit(p); await load(); f.hidden = true; } catch (x) { err(x); } };
