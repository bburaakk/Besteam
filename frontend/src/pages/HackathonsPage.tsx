import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/templates';
import { Heading, Alert, Button } from '../components/atoms';
import { hackathonsService } from '../services';
import type { HackathonItem } from '../services';

const HackathonsPage: React.FC = () => {
  const [items, setItems] = useState<HackathonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingFor, setCreatingFor] = useState<number | null>(null);
  const [teamName, setTeamName] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hackathonsService.getAll();
        setItems(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Hackathonlar yüklenirken bir hata oluştu';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <MainLayout title="Hackathonlar">
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
              <span>🚀</span> <span>Topluluk Etkinlikleri</span>
            </div>
            <Heading level={1} className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
              Hackathonlar
            </Heading>
            <p className="text-gray-600">Takımlara katıl, yeni takımlar kur ve yarışmalara hazır ol.</p>
          </div>

          {error && (
            <div className="mb-6"><Alert variant="error" message={error} onClose={() => setError(null)} /></div>
          )}

          {loading ? (
            <div className="py-16 flex items-center justify-center text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-2"></div>
              Veriler yükleniyor...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {items.map((h) => (
                <div key={h.id} className="group relative rounded-2xl border bg-white/80 backdrop-blur-md shadow-sm hover:shadow-xl transition-all overflow-hidden min-h-[260px] h-full flex flex-col">
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="text-lg font-semibold text-gray-900 line-clamp-2">{h.title}</div>
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                        {h.teams?.length ?? 0} takım
                      </span>
                    </div>
                    {h.description && <div className="text-sm text-gray-600 line-clamp-3 mb-4">{h.description}</div>}
                    <div className="text-xs text-gray-500 mb-4">
                      {h.start_date && <span>Başlangıç: {new Date(h.start_date).toLocaleDateString('tr-TR')}</span>}
                      {h.end_date && <span> • Bitiş: {new Date(h.end_date).toLocaleDateString('tr-TR')}</span>}
                      {h.location && <span> • {h.location}</span>}
                    </div>
                    <div className="mt-auto flex items-center justify-end gap-3">
                      <button
                        onClick={() => setCreatingFor(h.id)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm"
                      >
                        Takım Oluştur
                      </button>
                    </div>

                    {h.teams && h.teams.length > 0 && (
                      <div className="mt-4 bg-gray-50 rounded-xl p-3 border max-h-28 overflow-y-auto">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Takımlar</div>
                        <div className="space-y-2">
                          {h.teams.map(team => (
                            <div key={team.id} className="flex items-center justify-between gap-3">
                              <div className="text-sm text-gray-800 font-medium truncate">{team.name}</div>
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-500 flex-shrink-0">{team.members?.length ?? 0} üye</div>
                                <button
                                  onClick={async () => {
                                    try {
                                      await hackathonsService.joinTeam(team.id);
                                      alert('Takıma katılma isteği gönderildi.');
                                    } catch (e) {
                                      alert('Katılım sırasında hata oluştu.');
                                    }
                                  }}
                                  className="px-2 py-1 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                                  title={`Takıma katıl (#${team.id})`}
                                >
                                  Katıl
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {!h.teams?.length && (
                      <div className="mt-auto text-xs text-gray-400">Takım bilgisi yok</div>
                    )}
                  </div>
                </div>
              ))}
              {!items.length && (
                <div className="col-span-full text-center text-gray-500">Kayıt bulunamadı.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Team Create Modal (simple inline) */}
      {creatingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <div className="text-lg font-semibold mb-4">Takım Oluştur</div>
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Takım adı"
              className="w-full px-4 py-2 border rounded-xl mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => { setCreatingFor(null); setTeamName(''); }}>İptal</Button>
              <Button
                onClick={async () => {
                  if (!teamName.trim()) return;
                  try {
                    await hackathonsService.createTeam(creatingFor, teamName.trim());
                    setCreatingFor(null);
                    setTeamName('');
                    // refresh list
                    setLoading(true);
                    const data = await hackathonsService.getAll();
                    setItems(data);
                  } catch (e) {
                    alert('Takım oluşturulamadı');
                  } finally {
                    setLoading(false);
                  }
                }}
              >Oluştur</Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default HackathonsPage;


