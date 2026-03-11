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

function upper(value: string) {
  return value.toUpperCase();
}

export default function Create() {
  const [tips, setTips] = useState<Tipificaciones | null>(null);
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tipsErr, setTipsErr] = useState<string | null>(null);
  const [prefillLoading, setPrefillLoading] = useState(false);

  const yesNo: YesNo[] = ["SI", "NO"];
  const asistioOptions = ["SI", "NO", "REPROGRAMADA"];

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
    asistio_a_cita: "",
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
            asistio_a_cita: "",
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
      form.tipo_documento.trim().length > 0 &&
      form.fecha.trim().length > 0 &&
      form.tipo_orientacion.trim().length > 0 &&
      form.nombre_completo.trim().length > 0 &&
      form.genero.trim().length > 0 &&
      form.poblacion.trim().length > 0 &&
      Number(form.edad) > 0 &&
      form.barrio_vereda.trim().length > 0 &&
      form.direccion.trim().length > 0 &&
      form.telefono.trim().length > 0 &&
      form.eps.trim().length > 0 &&
      form.motivo.trim().length > 0 &&
      form.canal_atencion.trim().length > 0 &&
      form.activa_ruta.trim().length > 0 &&
      form.derivado_a.trim().length > 0 &&
      form.observacion.trim().length > 0 &&
      form.profesional.trim().length > 0
    );
  }, [form]);

  async function handleSubmit() {
    setError(null);
    setDoneId(null);
    setLoading(true);

    try {
      const payload: Orientacion = {
        ...form,
        id: upper(form.id),
        nombre_completo: upper(form.nombre_completo),
        direccion: upper(form.direccion),
        nombre_acudiente: upper(form.nombre_acudiente),
        observacion: upper(form.observacion),
        profesional: upper(form.profesional),
      };

      const r = await createOrientacion(payload);
      setDoneId(r.id);

      const documentoActual = payload.id;
      const baseFields = {
        tipo_documento: form.tipo_documento,
        nombre_completo: payload.nombre_completo,
        genero: form.genero,
        poblacion: form.poblacion,
        edad: form.edad,
        barrio_vereda: form.barrio_vereda,
        direccion: payload.direccion,
        telefono: form.telefono,
        eps: form.eps,
        tipo_acudiente: form.tipo_acudiente,
        nombre_acudiente: payload.nombre_acudiente,
        telefono_acudiente: form.telefono_acudiente,
        profesional: payload.profesional,
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
        asistio_a_cita: "",
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
              label="Documento"
              className="uppercase"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: upper(e.target.value) })}
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
              className="uppercase"
              value={form.nombre_completo}
              onChange={(e) =>
                setForm({ ...form, nombre_completo: upper(e.target.value) })
              }
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
              className="uppercase"
              value={form.direccion}
              onChange={(e) =>
                setForm({ ...form, direccion: upper(e.target.value) })
              }
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
              className="uppercase"
              value={form.nombre_acudiente}
              onChange={(e) =>
                setForm({ ...form, nombre_acudiente: upper(e.target.value) })
              }
            />

            <Input
              label="Teléfono acudiente"
              value={form.telefono_acudiente}
              onChange={(e) => setForm({ ...form, telefono_acudiente: e.target.value })}
            />

            <Input
              label="Observación"
              className="uppercase"
              value={form.observacion}
              onChange={(e) =>
                setForm({ ...form, observacion: upper(e.target.value) })
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
              {(tips?.pendiente_cita_presencial || yesNo).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Select
              label="Asistió a cita"
              value={form.asistio_a_cita ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  asistio_a_cita: e.target.value,
                })
              }
            >
              <option value="">Seleccione...</option>
              {((tips as any)?.asistio_a_cita || asistioOptions).map((v: string) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Input
              label="Profesional"
              className="uppercase"
              value={form.profesional}
              onChange={(e) =>
                setForm({ ...form, profesional: upper(e.target.value) })
              }
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
        </Card>
      </main>
    </div>
  );
}