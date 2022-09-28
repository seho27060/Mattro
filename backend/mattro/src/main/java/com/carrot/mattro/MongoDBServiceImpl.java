package com.carrot.mattro;

import com.carrot.mattro.DTO.OutputResponse;
import com.carrot.mattro.Repository.OutputRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MongoDBServiceImpl implements MongoDBService{

    private final OutputRepository outputR;
    private final Output invalidOutput = new Output();
    @Override
    public OutputResponse findPlaceBySubwayName(String subwayName) {
        List<Output> output = outputR.findAllBy역명(subwayName);
//        if(!output.isEmpty()){
//            return new OutputResponse(output.g);
//        }
        return null;
    }

    @Override
    public void findPlaceByUrl(String Url) {

    }

    @Override
    public void findPlaceListByChoiceList(String ChoiceList) {

    }

    @Override
    public void findPlaceListByUrl(String url) {

    }

    @Override
    public OutputResponse findPlaceByStoreIndex(String storeIndex) {
//        Output output = outputR.findByStoreIdx(storeIndex);
//        if(output.isPresent()){
//            return new OutputResponse(output.get());
//        }
//        else
            return null;
    }
}
