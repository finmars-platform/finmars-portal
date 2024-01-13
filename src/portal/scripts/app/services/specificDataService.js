import SpecificDataRepository from "../repositories/specificDataRepository";

export default function (cookieService, xhrService) {

    const specificDataRepository = new SpecificDataRepository(cookieService, xhrService);

    const getValuesForSelect = function (contentType, key, valueType, options) {
        return specificDataRepository.getValuesForSelect(contentType, key, valueType, options);
    };

    return {
        getValuesForSelect: getValuesForSelect,
    };

}