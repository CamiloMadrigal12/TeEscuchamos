import { useEffect, useMemo, useState } from "react";
import BrandHeader from "../components/BrandHeader";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { createOrientacion, getTipificaciones } from "../services/orientaciones";
import { Orientacion, YesNo } from "../types/orientacion";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Create() {
  const [tips, setTips] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const yesNo: YesNo[] = ["SI", "NO"];

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

  useEffect(() => {
    async function load() {
      try {
        const data = await getTipificaciones();
        setTips(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      form.id.trim().length > 3 &&
      form.tipo_documento &&
      form.fecha &&
      form.nombre_completo.trim().length > 2
    );
  }, [form]);

  async function handleSubmit() {
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
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <BrandHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-black text-brand-800">Crear registro</h2>

        <Card className="p-5 mt-6">

          <div className="grid md:grid-cols-3 gap-4">

            <Input
              label="Documento (ID)"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />

            <Select
              label="Tipo documento"
              value={form.tipo_documento}
              onChange={(e) =>
                setForm({ ...form, tipo_documento: e.target.value })
              }
            >
              {(tips?.tipo_documento || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Input
              label="Fecha"
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            />

            <Select
              label="Tipo de orientación"
              value={form.tipo_orientacion}
              onChange={(e) =>
                setForm({ ...form, tipo_orientacion: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              {(tips?.tipo_orientacion || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Input
              label="Nombre completo"
              value={form.nombre_completo}
              onChange={(e) =>
                setForm({ ...form, nombre_completo: e.target.value })
              }
            />

            <Select
              label="Género"
              value={form.genero}
              onChange={(e) =>
                setForm({ ...form, genero: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              {(tips?.sexo || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Select
              label="Población"
              value={form.poblacion}
              onChange={(e) =>
                setForm({ ...form, poblacion: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              {(tips?.poblacion || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Input
              label="Edad"
              type="number"
              value={String(form.edad)}
              onChange={(e) =>
                setForm({ ...form, edad: Number(e.target.value) })
              }
            />

            <Select
              label="Barrio / Vereda"
              value={form.barrio_vereda}
              onChange={(e) =>
                setForm({ ...form, barrio_vereda: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              {(tips?.barrio_vereda || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Input
              label="Dirección"
              value={form.direccion}
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value })
              }
            />

            <Input
              label="Teléfono"
              value={form.telefono}
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
            />

            <Select
              label="EPS"
              value={form.eps}
              onChange={(e) =>
                setForm({ ...form, eps: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              {(tips?.eps || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Select
              label="Motivo"
              value={form.motivo}
              onChange={(e) =>
                setForm({ ...form, motivo: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              {(tips?.motivo_atencion || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Select
              label="Canal de atención"
              value={form.canal_atencion}
              onChange={(e) =>
                setForm({ ...form, canal_atencion: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              {(tips?.canal_atencion || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Select
              label="Activa ruta"
              value={form.activa_ruta}
              onChange={(e) =>
                setForm({ ...form, activa_ruta: e.target.value as YesNo })
              }
            >
              {(tips?.activacion_ruta || yesNo).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Select
              label="Derivado a"
              value={form.derivado_a}
              onChange={(e) =>
                setForm({ ...form, derivado_a: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              {(tips?.derivado_a || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Select
              label="Tipo acudiente"
              value={form.tipo_acudiente}
              onChange={(e) =>
                setForm({ ...form, tipo_acudiente: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              {(tips?.tipo_acudiente || []).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Input
              label="Nombre acudiente"
              value={form.nombre_acudiente}
              onChange={(e) =>
                setForm({ ...form, nombre_acudiente: e.target.value })
              }
            />

            <Input
              label="Teléfono acudiente"
              value={form.telefono_acudiente}
              onChange={(e) =>
                setForm({ ...form, telefono_acudiente: e.target.value })
              }
            />

            <Input
              label="Observación"
              value={form.observacion}
              onChange={(e) =>
                setForm({ ...form, observacion: e.target.value })
              }
            />

            <Select
              label="Pendiente de cita presencial"
              value={form.pendiente_cita_presencial}
              onChange={(e) =>
                setForm({
                  ...form,
                  pendiente_cita_presencial: e.target.value as YesNo,
                })
              }
            >
              {(tips?.pendiente_cita_presencial || yesNo).map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>

            <Input
              label="Profesional"
              value={form.profesional}
              onChange={(e) =>
                setForm({ ...form, profesional: e.target.value })
              }
            />
          </div>

          <div className="mt-6 flex gap-2">
            <Button disabled={!canSubmit || loading} onClick={handleSubmit}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>

            {doneId && <div className="text-green-700">Guardado: {doneId}</div>}
            {error && <div className="text-red-700">{error}</div>}
          </div>

        </Card>
      </main>
    </div>
  );
}