export type Exoplanet = {
    pl_name: string
    type?: string;

    pl_rade?: number | null
    pl_bmasse?: number | null
    pl_orbper?: number | null
    pl_eqt?: number | null
    st_teff?: number | null
    st_mass?: number | null
    st_rad?: number | null
    st_met?: number | null
    pl_eqt_normalized?: number | null
    st_met_normalized?: number | null
    surface_gravity?: number | null
    surface_gravity_normalized?: number | null
    habitability_score?: number | null
    terraformability_score?: number | null
    st_activity?: number | null
    pl_atmos?: number | null
    pl_surf_temp?: number | null
    pl_escape_vel?: number | null
    pl_radiation_flux?: number | null
    ESI?: number | null
    pl_water_probability?: number | null
    pl_rade_normalized?: number | null
    pl_bmasse_normalized?: number | null
    [key: string]: string | number | null | undefined
}