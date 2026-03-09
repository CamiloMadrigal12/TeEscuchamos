import { useEffect, useMemo, useState } from "react";
import BrandHeader from "../components/BrandHeader";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import {
  createOrientacion,
  getTipificaciones,
  type Tipificaciones,
} from "../services/orientaciones";
import type { Orientacion, YesNo } from "../types/orientacion";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Create() {
  const [tips, setTips] = useState<Tipificaciones | null>(null);
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tipsErr, setTipsErr] = useState<string | null>(null);
  const [prefillLoading, setPrefillLoading] = useState(false);

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
    const loadTips = async () => {
      try {
        const data = await getTipificaciones();
        setTips(data);
      } catch (e: any) {
        console.error("Error cargando tipificaciones:", e);
        setTipsErr(e?.message ?? "No pude cargar tipificaciones.");
      }
    };

    loadTips();
  }, []);

  useEffect(() => {
    const preloadFromDocumento = async () => {
      const params = new URLSearchParams(window.location.search);
      const documento = params.get("documento")?.trim();

      if (!documento) return;

      setPrefillLoading(true);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `/api/orientaciones?id=${encodeURIComponent(documento)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || ""}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error ||
              data?.detail ||
              "No se pudo cargar la información del documento"
          );
        }

        if (data?.found && Array.isArray(data.items) && data.items.length > 0) {
          const last = data.items[0];

          setForm((prev) => ({
            ...prev,
            id: last.documento ?? documento,
            tipo_documento: last.tipo_documento ?? "CC",
            fecha: todayISO(),

            nombre_completo: last.nombre_completo ?? "",
            genero: last.genero ?? "",
            poblacion: last.poblacion ?? "",
            edad: Number(last.edad ?? 0),
            barrio_vereda: last.barrio_vereda ?? "",
            direccion: last.direccion ?? "",
            telefono: last.telefono ?? "",
            eps: last.eps ?? "",
            tipo_acudiente: last.tipo_acudiente ?? "",
            nombre_acudiente: last.nombre_acudiente ?? "",
            telefono_acudiente: last.telefono_acudiente ?? "",
            profesional: last.profesional ?? "",

            tipo_orientacion: "",
            motivo: "",
            canal_atencion: "",
            activa_ruta: "NO",
            derivado_a: "",
            observacion: "",
            pendiente_cita_presencial: "NO",
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            id: documento,
          }));
        }
      } catch (e: any) {
        console.error("Error cargando historial del documento:", e);
        setError(e?.message ?? "No se pudo cargar la información previa.");
      } finally {
        setPrefillLoading(false);
      }
    };

    preloadFromDocumento();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      form.id.trim().length > 0 &&
      String(form.tipo_documento).trim().length > 0 &&
      String(form.fecha).trim().length > 0 &&
      form.nombre_completo.trim().length > 0
    );
  }, [form]);

  async function handleSubmit() {
    setError(null);
    setDoneId(null);
    setLoading(true);

    try {
      const r = await createOrientacion(form);
      setDoneId(r.id);

      const documentoActual = form.id;
      const baseFields = {
        tipo_documento: form.tipo_documento,
        nombre_completo: form.nombre_completo,
        genero: form.genero,
        poblacion: form.poblacion,
        edad: form.edad,
        barrio_vereda: form.barrio_vereda,
        direccion: form.direccion,
        telefono: form.telefono,
        eps: form.eps,
        tipo_acudiente: form.tipo_acudiente,
        nombre_acudiente: form.nombre_acudiente,
        telefono_acudiente: form.telefono_acudiente,
        profesional: form.profesional,
      };

      setForm({
        id: documentoActual,
        ...baseFields,
        fecha: todayISO(),
        tipo_orientacion: "",
        motivo: "",
        canal_atencion: "",
        activa_ruta: "NO",
        derivado_a: "",
        observacion: "",
        pendiente_cita_presencial: "NO",
      });
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

        <Card className="mt-6 p-5">
          {tipsErr && (
            <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {tipsErr} (El formulario seguirá funcionando con opciones básicas.)
            </div>
          )}

          {prefillLoading && (
            <div className="mb-4 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-800">
              Cargando información previa del documento...
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Documento (ID)"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />

            <Select
              label="Tipo documento"
              value={form.tipo_documento}
              onChange={(e) => setForm({ ...form, tipo_documento: e.target.value })}
            >
              {(tips?.tipo_documento || [
                "CC",
                "TI",
                "RC",
                "PPT",
                "CE",
                "PASAPORTE",
                "OTRO",
              ]).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
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
              onChange={(e) => setForm({ ...form, tipo_orientacion: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {(tips?.tipo_orientacion || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Input
              label="Nombre completo"
              value={form.nombre_completo}
              onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })}
            />

            <Select
              label="Género"
              value={form.genero}
              onChange={(e) => setForm({ ...form, genero: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {(tips?.sexo || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Select
              label="Población"
              value={form.poblacion}
              onChange={(e) => setForm({ ...form, poblacion: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {(tips?.poblacion || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Input
              label="Edad"
              type="number"
              value={String(form.edad)}
              onChange={(e) => setForm({ ...form, edad: Number(e.target.value) })}
            />

            <Select
              label="Barrio / Vereda"
              value={form.barrio_vereda}
              onChange={(e) => setForm({ ...form, barrio_vereda: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {(tips?.barrio_vereda || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Input
              label="Dirección"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            />

            <Input
              label="Teléfono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />

            <Select
              label="EPS"
              value={form.eps}
              onChange={(e) => setForm({ ...form, eps: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {(tips?.eps || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Select
              label="Motivo"
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {(tips?.motivo_atencion || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Select
              label="Canal de atención"
              value={form.canal_atencion}
              onChange={(e) => setForm({ ...form, canal_atencion: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {(tips?.canal_atencion || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Select
              label="Activa ruta"
              value={form.activa_ruta}
              onChange={(e) => setForm({ ...form, activa_ruta: e.target.value as YesNo })}
            >
              {(tips?.activacion_ruta || yesNo).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Select
              label="Derivado a"
              value={form.derivado_a}
              onChange={(e) => setForm({ ...form, derivado_a: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {(tips?.derivado_a || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Select
              label="Tipo acudiente"
              value={form.tipo_acudiente}
              onChange={(e) => setForm({ ...form, tipo_acudiente: e.target.value })}
            >
              <option value="">Seleccione...</option>
              {(tips?.tipo_acudiente || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Input
              label="Nombre acudiente"
              value={form.nombre_acudiente}
              onChange={(e) => setForm({ ...form, nombre_acudiente: e.target.value })}
            />

            <Input
              label="Teléfono acudiente"
              value={form.telefono_acudiente}
              onChange={(e) => setForm({ ...form, telefono_acudiente: e.target.value })}
            />

            <Input
              label="Observación"
              value={form.observacion}
              onChange={(e) => setForm({ ...form, observacion: e.target.value })}
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
              {(tips?.pendiente_cita_presencial || yesNo).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Input
              label="Profesional"
              value={form.profesional}
              onChange={(e) => setForm({ ...form, profesional: e.target.value })}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button disabled={!canSubmit || loading} onClick={handleSubmit}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>

            {doneId && (
              <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-700">
                Guardado OK. Documento: <span className="font-semibold">{doneId}</span>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Endpoints:{" "}
            <code className="rounded bg-slate-100 px-1">GET /api/orientaciones?id=</code> y{" "}
            <code className="rounded bg-slate-100 px-1">POST /api/orientaciones</code> y{" "}
            <code className="rounded bg-slate-100 px-1">GET /api/tipificaciones</code>.
          </div>
        </Card>
      </main>
    </div>
  );
}