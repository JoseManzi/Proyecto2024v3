using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Proyecto2024v3.Models;
using Proyecto2024v3.Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


namespace Proyecto2024v3.Controllers;

[Authorize]


    public class EjercicioFisicoController : Controller
    {
        private ApplicationDbContext _context;

        public EjercicioFisicoController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Crear una lista de SelectListItem que incluya el elemento adicional
            var selectListItems = new List<SelectListItem>
        {
            new SelectListItem { Value = "0", Text = "[SELECCIONE...]" }
        };

            // Obtener todas las opciones del enum
            var enumValues = Enum.GetValues(typeof(EstadoEmocional)).Cast<EstadoEmocional>();

            // Convertir las opciones del enum en SelectListItem
            selectListItems.AddRange(enumValues.Select(e => new SelectListItem
            {
                Value = e.GetHashCode().ToString(),
                Text = e.ToString().ToUpper()
            }));

            // Pasar la lista de opciones al modelo de la vista
            ViewBag.EstadoEmocionalInicio = selectListItems.OrderBy(t => t.Text).ToList();
            ViewBag.EstadoEmocionalFin = selectListItems.OrderBy(t => t.Text).ToList();

            var tipoEjercicios = _context.TipoEjercicios.ToList();
            tipoEjercicios.Add(new TipoEjercicio { TipoEjercicioID = 0, Descripcion = "[SELECCIONE...]" });
            ViewBag.TipoEjercicioID = new SelectList(tipoEjercicios.OrderBy(c => c.Descripcion), "TipoEjercicioID", "Descripcion");

            return View();
        }
        public JsonResult ListadoEjerciciosFisicos(int? id)
        {
            List<VistaEjercicioFisico> ejerciciosFisicosMostrar = new List<VistaEjercicioFisico>();

            var ejerciciosFisicos = _context.EjerciciosFisicos.ToList();

            if (id != null)
            {
                ejerciciosFisicos = ejerciciosFisicos.Where(t => t.TipoEjercicioID == id).ToList();
            }

            var tiposEjercicios = _context.TipoEjercicios.ToList();

            foreach (var ejercicioFisico in ejerciciosFisicos)
            {
                var tipoEjercicio = tiposEjercicios.Where(t => t.TipoEjercicioID == ejercicioFisico.TipoEjercicioID).Single();

                var ejercicioFisicoMostrar = new VistaEjercicioFisico
                {
                    EjercicioFisicoID = ejercicioFisico.EjercicioFisicoID,
                    TipoEjercicioID = ejercicioFisico.TipoEjercicioID,
                    TipoEjercicioDescripcion = tipoEjercicio.Descripcion,
                    FechaInicioString = ejercicioFisico.Inicio.ToString("dd/MM/yyyy HH:mm"),
                    FechaFinString = ejercicioFisico.Fin.ToString("dd/MM/yyyy HH:mm"),
                    EstadoEmocionalInicio = Enum.GetName(typeof(EstadoEmocional), ejercicioFisico.EstadoEmocionalInicio),
                    EstadoEmocionalFin = Enum.GetName(typeof(EstadoEmocional), ejercicioFisico.EstadoEmocionalFin),
                    Observaciones = ejercicioFisico.Observaciones
                };
                ejerciciosFisicosMostrar.Add(ejercicioFisicoMostrar);
            }

            return Json(ejerciciosFisicosMostrar);
        }


        // public JsonResult ListadoEjerciciosFisicos(int? id)
        // {
        //     var ejerciciosFisicos = _context.EjerciciosFisicos.Include(e => e.TipoEjercicio).ToList();

        //     if (id != null)
        //     {
        //         ejerciciosFisicos = ejerciciosFisicos.Where(t => t.EjercicioFisicoID == id).ToList();
        //     }

        //     var mostrarEjerciciosFisicos = ejerciciosFisicos.Select(e => new
        //     {
        //         TipoEjercicio = e.TipoEjercicio,
        //         Inicio = e.Inicio.ToString("yyyy-MM-ddTHH:mm:ss"),
        //         Fin = e.Fin.ToString("yyyy-MM-ddTHH:mm:ss"),
        //         EstadoEmocionalInicio = e.EstadoEmocionalInicio.ToString(),
        //         EstadoEmocionalFin = e.EstadoEmocionalFin.ToString(),
        //         Observaciones = e.Observaciones
        //     }).ToList();

        //     return Json(mostrarEjerciciosFisicos);
        // }


        public JsonResult GuardarRegistro(int ejercicioFisicoID, int tipoEjercicioID, DateTime inicio, DateTime fin, EstadoEmocional estadoEmocionalInicio, EstadoEmocional estadoEmocionalFin, string observaciones)
        {
            string resultado = "";

            if (ejercicioFisicoID == 0)
            {
                var ejercicioFisico = new EjercicioFisico
                {
                    EjercicioFisicoID = ejercicioFisicoID,
                    TipoEjercicioID = tipoEjercicioID,
                    Inicio = inicio,
                    Fin = fin,
                    EstadoEmocionalInicio = estadoEmocionalInicio,
                    EstadoEmocionalFin = estadoEmocionalFin,
                    Observaciones = observaciones
                };

                _context.EjerciciosFisicos.Add(ejercicioFisico);
                _context.SaveChanges();

                // var inicioEstadoEmocional = ejercicioFisico.EstadoEmocionalInicio.ToString();
                // var finEstadoEmocional = ejercicioFisico.EstadoEmocionalFin.ToString();
                // var textoObservaciones = ejercicioFisico.Observaciones.ToString();

            }
            else        //EDICION
            {
                var ejercicioFisicoEditar = _context.EjerciciosFisicos.Where(e => e.EjercicioFisicoID == ejercicioFisicoID).SingleOrDefault();
                {

                    var existeEjercicioFisico = _context.EjerciciosFisicos.Where(e => e.EjercicioFisicoID == ejercicioFisicoID).Count();
                }
                {
                    ejercicioFisicoEditar.TipoEjercicioID = tipoEjercicioID;
                    ejercicioFisicoEditar.Inicio = inicio;
                    ejercicioFisicoEditar.Fin = fin;
                    ejercicioFisicoEditar.EstadoEmocionalInicio = estadoEmocionalInicio;
                    ejercicioFisicoEditar.EstadoEmocionalFin = estadoEmocionalFin;
                    ejercicioFisicoEditar.Observaciones = observaciones;

                    _context.SaveChanges();
                }
            }


            return Json(resultado);
        }


        public JsonResult EliminarEjercicioFisico(int ejercicioFisicoID)
        {
            var ejercicioFisico = _context.EjerciciosFisicos.Find(ejercicioFisicoID);
            _context.Remove(ejercicioFisico);
            _context.SaveChanges();

            return Json(true);
        }
        

        public JsonResult TraerListaEjercicios(int? ejercicioFisicoID)
        {
            var ejerciciosFisicos = _context.EjerciciosFisicos.ToList();

            if (ejercicioFisicoID != null)
            {
                ejerciciosFisicos = ejerciciosFisicos.Where(e => e.EjercicioFisicoID == ejercicioFisicoID).ToList();
            }

            return Json(ejerciciosFisicos.ToList());
        }

    }





