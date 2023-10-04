import SpecificDataRepository from "../repositories/specificDataRepository";

export default function (cookieService, xhrService) {

    const specificDataRepository = new SpecificDataRepository(cookieService, xhrService);

    var getValuesForSelect = function (contentType, key, valueType) {
        return specificDataRepository.getValuesForSelect(contentType, key, valueType);
    };

    return {
        getValuesForSelect: getValuesForSelect,
    };

}