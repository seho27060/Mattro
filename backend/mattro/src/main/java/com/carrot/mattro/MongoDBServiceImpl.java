package com.carrot.mattro;

import com.carrot.mattro.DTO.OutputResponse;
import com.carrot.mattro.Repository.OutputRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MongoDBServiceImpl implements MongoDBService{

    private final OutputRepository outputR;
    private final Output invalidOutput = new Output();
    @Override
    public OutputResponse findPlaceBySubwayName(String subwayName) {
        Optional<Output> output = outputR.findBy역명(subwayName);
        if(output.isPresent()){
            return new OutputResponse(output.get());
        }
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
}
