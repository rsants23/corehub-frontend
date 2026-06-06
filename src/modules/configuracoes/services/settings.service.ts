const USE_MOCK = true;

export const settingsService = {
  async getClinicInfo() {
    if (USE_MOCK) {
      return {
        name: "Clínica Efata",
        cnpj: "00.000.000/0001-00",
        phone: "(11) 3000-0000",
        email: "contato@clinicaefata.com",
      };
    }
    return null;
  },
};
