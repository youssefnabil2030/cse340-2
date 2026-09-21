// Fetch organizations including new rubric columns
projectModel.getOrganizations = async function() {
  try {
    const sql = "SELECT organization_id, name, description, contact_email, logo_filename, location, date_created FROM public.organizations ORDER BY name ASC"
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getOrganizations error: " + error)
    return []
  }
}
