package com.carrot.mattro.Repository;

import com.carrot.mattro.Output;
import static org.assertj.core.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class OutputRepositoryTest {


    @Autowired
    OutputRepository outputRepository;
    @Test
    void findBy역명() {
        String subwayName = "논현";
        List<Output> output = outputRepository.findAllBy역명(subwayName);
        assertThat(output).isNotEmpty();
        assertThat(output.get(0).get역명()).isEqualTo(subwayName);
    }
}