import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_OPTION } from 'src/main';
import { KafkaTcpController } from './kafka.tcp.controller';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_OPTION,
      },
    ]),
  ],
  providers: [KafkaService],
  controllers: [KafkaTcpController],
  exports: [], //
})
export class KafkaModule {}
/***
 * 1.컨트롤러
 *  1) http : 요청을 받아서 카프카 서비스로 전달
 *  2) tcp : 카프카 서비스로부터 응답을 받아서 클라이언트에게 전달
 *
 * 2.서비스
 * 1) 카프카 클라이언트를 사용하여 메시지를 전송
 * 2) SSE 서비스를 주입받아 TCP 컨트롤러에서 이벤트를 받은 뒤 SSE로 전달
 */
