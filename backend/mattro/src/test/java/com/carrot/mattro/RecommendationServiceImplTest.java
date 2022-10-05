package com.carrot.mattro;

import com.carrot.mattro.Repository.OutputRepository;
import com.carrot.mattro.domain.entity.Output;
import com.carrot.mattro.domain.entity.Subway;
import com.carrot.mattro.domain.repository.SubwayRepository;
import com.carrot.mattro.service.RecommendationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceImplTest {

    @InjectMocks
    private RecommendationServiceImpl target;
    @Mock
    OutputRepository outputRepository;
    @Mock
    SubwayRepository subwayRepository;

    private final String subwayName = "신당";

    @Test
    public void 역근처List(){
        // given
        doReturn(Arrays.asList(
                Output.builder().build(),
                Output.builder().build(),
                Output.builder().build()
        )).when(outputRepository).findAllBy역명(subwayName);

        // when
        final List<Output> result = outputRepository.findAllBy역명(subwayName);

        // then
        assertThat(result.size()).isEqualTo(3);

    }

    @Test
    void 역위치받기(){
        // given

        // when
        Subway result = subwayRepository.findBy역명(subwayName);

        // then
    }

    @Test
    void 역과거리에따른기준잡는함수(){
        // given
        final Subway subway = Subway.builder()
                .역명(subwayName)
                .위도(37.566292)
                .경도(126.991773)
                .build();

        final List<Output> store = outputRepository.findAllBy역명(subway.get역명());

        // when

    }
}
