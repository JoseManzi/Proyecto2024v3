using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Proyecto2024v3.Models;

namespace Proyecto2024v3.Models
{
    public class EjercicioFisico
    {
        [Key]
        public int EjercicioFisicoID { get; set; }
        public int TipoEjercicioID { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Fin { get; set; }
        public EstadoEmocional EstadoEmocionalInicio { get; set; }
        public EstadoEmocional EstadoEmocionalFin { get; set; }
        public string? Observaciones { get; set; }

        public virtual TipoEjercicio TipoEjercicio { get; set; }
    }

    public enum EstadoEmocional
    {
        Feliz = 1,
        Triste,
        Enojado,
        Ansioso,
        Estresado,
        Relajado,
        Aburrido,
        Emocionado,
        Agobiado,
        Confundido,
        Optimista,
        Pesimista,
        Motivado,
        Cansado,
        Eufórico,
        Agitado,
        Satisfecho,
        Desanimado
    }

    

    // agregar a vistas
    // public class VistaSumaEjercicioFisico
    // {
    //     public string? TipoEjercicioNombre { get; set; }
    //     public int TotalidadMinutos { get; set; }
    //     public int TotalidadDiasConEjercicio { get; set; }
    //     public int TotalidadDiasSinEjercicio { get; set; }

    //     public List<VistaEjercicioFisico>? DiasEjercicios { get; set; }
    // }

public class VistaEjercicioFisico
    {
        public int EjercicioFisicoID { get; set; }
        public int TipoEjercicioID { get; set; }
        public string? TipoEjercicioDescripcion { get; set; }
        public string FechaInicioString { get; set; }
        public string FechaFinString { get; set; }
        public string? EstadoEmocionalInicio { get; set; }
        public string? EstadoEmocionalFin { get; set; }
        public string? Observaciones { get; set; }
    }
}