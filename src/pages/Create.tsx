import { useEffect, useMemo, useState } from "react";
import BrandHeader from "../components/BrandHeader";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { createOrientacion, getTipificaciones, Tipificaciones } from "../services/orientaciones";
import { Orientacion, YesNo } from "../types/orientacion";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Create() {
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [tips, setTips] = useState<Tipificaciones | null>(null);
  const [tipsErr, setTipsErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const t = await getTipificaciones();
        setTips(t);
      } catch (e: any) {
        setTipsErr(e?.message ?? "No pude cargar tipificaciones.");
      }
    })();
  }, []);

  const [form, setForm] = useState<Orientacion>({
    id: "",
    tipo_documento: "CC",
    fecha: todayISO(),
    tipo_orientacion: "",
    nombre_completo: "",
    genero: "",
    poblacion: "",
    edad: 0,
    barrio_vereda: "",
    direccion: "",
    telefono: "",
    eps: "",
    motivo: "",
    canal_atencion: "",
    activa_ruta: "NO",
    derivado_a: "",
    tipo_acudiente: "",
    nombre_acudiente: "",
    telefono_acudiente: "",
    observacion: "",
    pendiente_cita_presencial: "NO",
    profesional: "",
  });

  const canSubmit = useMemo(() => {
    return (
      form.id.trim().length > 3 &&
      form.tipo_documento &&
      form.fecha &&
      form.nombre_completo.trim().length > 2
    );
  }, [form]);

  const yn: YesNo[] = ["SI", "NO"];

  return (
    <div className="min-h-screen bg-slate-50">
      <BrandHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-black text-brand-800">Crear registro</h2>
        <p className="text-sm text-slate-600 mt-1"></p>

        <Card className="p-5 mt-6">
          {tipsErr && (
            <div className="mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              {tipsErr} (El formulario seguirá funcionando con opciones básicas.)
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <Input label="Documento (ID)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
            <Select label="Tipo documento" value={form.tipo_documento} onChange={(e) => setForm({ ...form, tipo_documento: e.target.value })}>
              {(tips?.tipo_documento ?? ["CC","TI","CE","PA","RC","NIT","OTRO"]).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>
            <Input label="Fecha" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />

            <Input label="Tipo de orientación" value={form.tipo_orientacion} onChange={(e) => setForm({ ...form, tipo_orientacion: e.target.value })} />
            <Input label="Nombre completo" value={form.nombre_completo} onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })} />

            <Select label="Género" value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })}>
              <option value="">Seleccione…</option>
              {(tips?.genero ?? ["Femenino","Masculino","Otro","No responde"]).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Input label="Población" value={form.poblacion} onChange={(e) => setForm({ ...form, poblacion: e.target.value })} />
            <Input label="Edad" type="number" value={String(form.edad)} onChange={(e) => setForm({ ...form, edad: Number(e.target.value) })} />

            <Select label="Barrio / Vereda" value={form.barrio_vereda} onChange={(e) => setForm({ ...form, barrio_vereda: e.target.value })}>
              <option value="">Seleccione…</option>
              {(tips?.barrio_vereda ?? []).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Input label="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            <Input label="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            <Input label="EPS" value={form.eps} onChange={(e) => setForm({ ...form, eps: e.target.value })} />

            <Input label="Motivo" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
            <Select label="Canal de atención" value={form.canal_atencion} onChange={(e) => setForm({ ...form, canal_atencion: e.target.value })}>
              <option value="">Seleccione…</option>
              {(tips?.canal_atencion ?? ["Presencial","Telefónico","WhatsApp","Correo","Otro"]).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Select label="Activa ruta" value={form.activa_ruta} onChange={(e) => setForm({ ...form, activa_ruta: e.target.value as YesNo })}>
              {(tips?.activa_ruta ?? yn).map(v => <option key={v} value={v}>{v}</option>)}
            </Select>

            <Input label="Derivado a" value={form.derivado_a} onChange={(e) => setForm({ ...form, derivado_a: e.target.value })} />
            <Input label="Tipo acudiente" value={form.tipo_acudiente} onChange={(e) => setForm({ ...form, tipo_acudiente: e.target.value })} />

            <Input label="Nombre acudiente" value={form.nombre_acudiente} onChange={(e) => setForm({ ...form, nombre_acudiente: e.target.value })} />
            <Input label="Teléfono acudiente" value={form.telefono_acudiente} onChange={(e) => setForm({ ...form, telefono_acudiente: e.target.value })} />

            <Input label="Observación" value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} />
            <Select
              label="Pendiente de cita presencial"
              value={form.pendiente_cita_presencial}
              onChange={(e) => setForm({ ...form, pendiente_cita_presencial: e.target.value as YesNo })}
            >
              {(tips?.pendiente_cita_presencial ?? yn).map(v => <option key={v} value={v}>{v}</option>)}
            </Select>
            <Input label="Profesional" value={form.profesional} onChange={(e) => setForm({ ...form, profesional: e.target.value })} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2 items-center">
            <Button
              onClick={async () => {
                setError(null);
                setDoneId(null);
                setLoading(true);
                try {
                  const r = await createOrientacion(form);
                  setDoneId(r.id);
                } catch (e: any) {
                  setError(e?.message ?? "Error guardando.");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={!canSubmit || loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>

            {doneId && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                Guardado OK. Documento: <span className="font-semibold">{doneId}</span>
              </div>
            )}
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Endpoints: <code className="px-1 rounded bg-slate-100">GET /api/orientaciones?id=</code> y{" "}
            <code className="px-1 rounded bg-slate-100">POST /api/orientaciones</code> y{" "}
            <code className="px-1 rounded bg-slate-100">GET /api/tipificaciones</code>.
          </div>
        </Card>
      </main>
    </div>
  );
}
