---
title: "exporter 설치하기"
description: "prometheus 로 관측할 대상에 대한 설치를 먼저 진행해보자모니터링 대상의 metric을 수집하고 prometheus가 접속했을 때 정보를 알려주는 역할종류node-exporter호스트 서버의 CPU, memory 등을 수집ngnix-exporternginx 데이"
date: 2022-01-29T07:35:21.795Z
tags: ["프로메테우스"]
---
- prometheus 로 관측할 대상에 대한 설치를 먼저 진행해보자

# exporter 설치 

> 모니터링 대상의 metric을 수집하고 prometheus가 접속했을 때 정보를 알려주는 역할

- 종류
  - node-exporter
    - 호스트 서버의 CPU, memory 등을 수집
  - ngnix-exporter
    - nginx 데이터를 수집
  - cAdvisor
    - docker container 데이터 수집
  - 그외 : https://prometheus.io/docs/instrumenting/exporters/
- 해야할 설정
  - Exporter를 실행하면 데이터를 수집하는 동시에 HTTP 엔드 포인트를 열어서(node exporter의 기본은 9100포트) prometheus 서버가 데이터를 수집해 갈 수 있도록 한다. ( prometheus Server는 Exporter가 열어놓은 HTTP 엔드포인트에 접속해서 Metric을 수집하는 Pull 방식)

## node exporter 

> https://github.com/prometheus/node_exporter

- node exporter의 경우 호스트 시스템을 모니터링 하도록 설계되어 있기 떄문에, 호스트 시스템에 액세스 해야함. 
  - Docker 컨테이너로 배포하는 것은 권장하는 바가 아니지만, docker 로 사용했을 때랑 그냥 서비스로 설치했을 때랑 플래그 조정만 한다면 개인적으론 차이를 느끼지 못했음
  - 배포의 편의성과 나중에 때어내거나 수정할 때 용의성을 위해 나는 docker-compose 로 작업했음.
- Docker로 배포할 경우 주의 사항
  - 모니터링 하려는 루트가 아닌 마운트 지점은 컨테이너에 바인드 마운트해야함
- node exporter 의 기본적으로 9100 포트에서 수신대기
- [node exporter 의 metrics 내용](#node-exporter-metrics) 

### docker 로 설치할 경우

```shell
# 그냥 docker 명령어로 실행할 경우
docker run -d \
  --net="host" \
  --pid="host" \
  -v "/:/host:ro,rslave" \
  quay.io/prometheus/node-exporter:latest \
  --path.rootfs=/host
```

### docker-compose 로 설치할 경우

```shell
# docker-compose.yml 로 구성할 경우
version: '3.8'

services:
  node_exporter:
    image: quay.io/prometheus/node-exporter:latest
    container_name: node_exporter
    command:
      - '--path.rootfs=/host'
    network_mode: host
    pid: host
    restart: unless-stopped
    volumes:
      - '/:/host:ro,rslave'
```

### 테스트 하기

```shell
# node exporter 에 prometheus 가 와서 가져갈 metrics 확인하기
curl localhost:9100/metrics

```

### 데이터 검증하기

```shell
# cpu 관련
## node exporter 자료 - cpu 로드율
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)
## top 의 자료 -> cmd 에 top 치고 세번쨰줄(cpu) 의 id % 부분 확인
## id 는 유휴 상태의 cpu 비중을 의미하기 때문에 100 -id 값이 위의 node exporter값과 같은지 확인

# hdd 사용량 관련
## node exporter 자료 - hdd 사용량(퍼센트)
(node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes and ON (instance, device, mountpoint) node_filesystem_readonly == 0
## df -P 에서 루트 디렉토리의 사용량을 읽고 node-exporter의 자료와 같은지 확인
df -P

# memory 관련
## node-exporter의 자료 - 메모리 사용량(퍼센트)
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100
## 방법1 ) top에서 memeory 사용량 보기
## 방법2 ) free 를 치고 memeory 사용량 보기 

```


## cadvisor 

- 도커 호스트에 컨테이너로서 실행되는 모니터링 툴로, 도커 엔진 및 컨테이너, 이미지 등에 대한 데이터등을 수집해준다.
- 설치가 완료되면 아래와 같은 페이지를 열 수 있다.
  - prometheus 페이지처럼 간단하게 정보를 볼 수 있다.
![](../images/49d609f3-48c2-438a-8e5a-45341313e5f2-2021-12-29-09-46-31.png)


### docker로 설치하기

> https://github.com/google/cadvisor

```shell
VERSION=v0.36.0 # use the latest release version from https://github.com/google/cadvisor/releases
sudo docker run \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:ro \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --volume=/dev/disk/:/dev/disk:ro \
  --publish=열기원하는포트:8080 \
  --detach=true \
  --name=cadvisor \
  --privileged \
  --device=/dev/kmsg \
  gcr.io/cadvisor/cadvisor:$VERSION
```


### docker-compose 로 설치할 경우

```yml
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor 
    ports: 
      - 열기원하는포트:8080 
    volumes: 
      - /:/rootfs:ro 
      - /var/run:/var/run:rw 
      - /sys:/sys:ro 
      - /var/lib/docker/:/var/lib/docker:ro 
      - /dev/disk/:/dev/disk:ro 
    restart: always 
    devices:
      - "/dev/kmsg:/dev/kmsg"
    privileged: true 
```


### 테스트하기

```shell
# cadvisor 에 prometheus 가 와서 가져갈 metrics 확인하기
curl localhost:열었던포트/metrics
```


# 참고자료

## node-exporter metrics

> 출처 : https://docs.splunk.com/observability/gdi/prometheus-node/prometheus-node.html

| Name                                     | Description                                                  | Type       |
| ---------------------------------------- | ------------------------------------------------------------ | ---------- |
| node_arp_entries                         | ARP entries by device                                        | gauge      |
| node_boot_time_seconds                   | Node boot time, in unixtime                                  | gauge      |
| node_context_switches_total              | Total number of context switches                             | cumulative |
| node_cpu_guest_seconds_total             | Seconds the cpus spent in guests (VMs) for each mode         | cumulative |
| node_cpu_seconds_total                   | Seconds the cpus spent in each mode                          | cumulative |
| node_disk_io_now                         | The number of I/Os currently in progress                     | gauge      |
| node_disk_io_time_seconds_total          | Total seconds spent doing I/Os                               | cumulative |
| node_disk_io_time_weighted_seconds_total | The weighted number of seconds spent doing I/Os. See https://www.kernel.org/doc/Documentation/iostats.txt | cumulative |
| node_disk_read_bytes_total               | The total number of bytes read successfully                  | cumulative |
| node_disk_read_time_seconds_total        | The total number of milliseconds spent by all reads          | cumulative |
| node_disk_reads_completed_total          | The total number of reads completed successfully             | cumulative |
| node_disk_reads_merged_total             | The total number of reads merged. See https://www.kernel.org/doc/Documentation/iostats.txt | cumulative |
| node_disk_write_time_seconds_total       | This is the total number of seconds spent by all writes      | cumulative |
| node_disk_writes_completed_total         | The total number of writes completed successfully            | cumulative |
| node_disk_writes_merged_total            | The number of writes merged. See https://www.kernel.org/doc/Documentation/iostats.txt | cumulative |
| node_disk_written_bytes_total            | The total number of bytes written successfully               | cumulative |
| node_entropy_available_bits              | Bits of available entropy                                    | gauge      |
| node_exporter_build_info                 | A metric with a constant '1' value labeled by version, revision, branch, and goversion from which node_exporter was built | gauge      |
| node_filefd_allocated                    | File descriptor statistics: allocated                        | gauge      |
| node_filefd_maximum                      | File descriptor statistics: maximum                          | gauge      |
| node_filesystem_avail_bytes              | Filesystem space available to non-root users in bytes        | gauge      |
| node_filesystem_device_error             | Whether an error occurred while getting statistics for the given device | gauge      |
| node_filesystem_files                    | Filesystem total file nodes                                  | gauge      |
| node_filesystem_files_free               | Filesystem total free file nodes                             | gauge      |
| node_filesystem_free_bytes               | Filesystem free space in bytes                               | gauge      |
| node_filesystem_readonly                 | Filesystem read-only status                                  | gauge      |
| node_filesystem_size_bytes               | Filesystem size in bytes                                     | gauge      |
| node_forks_total                         | Total number of forks                                        | cumulative |
| node_intr_total                          | Total number of interrupts serviced                          | cumulative |
| node_ipvs_connections_total              | The total number of connections made                         | cumulative |
| node_ipvs_incoming_bytes_total           | The total amount of incoming data                            | cumulative |
| node_ipvs_incoming_packets_total         | The total number of incoming packets                         | cumulative |
| node_ipvs_outgoing_bytes_total           | The total amount of outgoing data                            | cumulative |
| node_ipvs_outgoing_packets_total         | The total number of outgoing packets                         | cumulative |
| node_load1                               | 1m load average                                              | gauge      |
| node_load15                              | 15m load average                                             | gauge      |
| node_load5                               | 5m load average                                              | gauge      |
| node_memory_Active_anon_bytes            | Memory information field Active_anon_bytes                   | gauge      |
| node_memory_Active_bytes                 | Memory information field Active_bytes                        | gauge      |
| node_memory_Active_file_bytes            | Memory information field Active_file_bytes                   | gauge      |
| node_memory_AnonHugePages_bytes          | Memory information field AnonHugePages_bytes                 | gauge      |
| node_memory_AnonPages_bytes              | Memory information field AnonPages_bytes                     | gauge      |
| node_memory_Bounce_bytes                 | Memory information field Bounce_bytes                        | gauge      |
| node_memory_Buffers_bytes                | Memory information field Buffers_bytes                       | gauge      |
| node_memory_Cached_bytes                 | Memory information field Cached_bytes                        | gauge      |
| node_memory_CommitLimit_bytes            | Memory information field CommitLimit_bytes                   | gauge      |
| node_memory_Committed_AS_bytes           | Memory information field Committed_AS_bytes                  | gauge      |
| node_memory_DirectMap1G_bytes            | Memory information field DirectMap1G_bytes                   | gauge      |
| node_memory_DirectMap2M_bytes            | Memory information field DirectMap2M_bytes                   | gauge      |
| node_memory_DirectMap4k_bytes            | Memory information field DirectMap4k_bytes                   | gauge      |
| node_memory_Dirty_bytes                  | Memory information field Dirty_bytes                         | gauge      |
| node_memory_HugePages_Free               | Memory information field HugePages_Free                      | gauge      |
| node_memory_HugePages_Rsvd               | Memory information field HugePages_Rsvd                      | gauge      |
| node_memory_HugePages_Surp               | Memory information field HugePages_Surp                      | gauge      |
| node_memory_HugePages_Total              | Memory information field HugePages_Total                     | gauge      |
| node_memory_Hugepagesize_bytes           | Memory information field Hugepagesize_bytes                  | gauge      |
| node_memory_Inactive_anon_bytes          | Memory information field Inactive_anon_bytes                 | gauge      |
| node_memory_Inactive_bytes               | Memory information field Inactive_bytes                      | gauge      |
| node_memory_Inactive_file_bytes          | Memory information field Inactive_file_bytes                 | gauge      |
| node_memory_KernelStack_bytes            | Memory information field KernelStack_bytes                   | gauge      |
| node_memory_Mapped_bytes                 | Memory information field Mapped_bytes                        | gauge      |
| node_memory_MemAvailable_bytes           | Memory information field MemAvailable_bytes                  | gauge      |
| node_memory_MemFree_bytes                | Memory information field MemFree_bytes                       | gauge      |
| node_memory_MemTotal_bytes               | Memory information field MemTotal_bytes                      | gauge      |
| node_memory_Mlocked_bytes                | Memory information field Mlocked_bytes                       | gauge      |
| node_memory_NFS_Unstable_bytes           | Memory information field NFS_Unstable_bytes                  | gauge      |
| node_memory_PageTables_bytes             | Memory information field PageTables_bytes                    | gauge      |
| node_memory_SReclaimable_bytes           | Memory information field SReclaimable_bytes                  | gauge      |
| node_memory_SUnreclaim_bytes             | Memory information field SUnreclaim_bytes                    | gauge      |
| node_memory_ShmemHugePages_bytes         | Memory information field ShmemHugePages_bytes                | gauge      |
| node_memory_ShmemPmdMapped_bytes         | Memory information field ShmemPmdMapped_bytes                | gauge      |
| node_memory_Shmem_bytes                  | Memory information field Shmem_bytes                         | gauge      |
| node_memory_Slab_bytes                   | Memory information field Slab_bytes                          | gauge      |
| node_memory_SwapCached_bytes             | Memory information field SwapCached_bytes                    | gauge      |
| node_memory_SwapFree_bytes               | Memory information field SwapFree_bytes                      | gauge      |
| node_memory_SwapTotal_bytes              | Memory information field SwapTotal_bytes                     | gauge      |
| node_memory_Unevictable_bytes            | Memory information field Unevictable_bytes                   | gauge      |
| node_memory_VmallocChunk_bytes           | Memory information field VmallocChunk_bytes                  | gauge      |
| node_memory_VmallocTotal_bytes           | Memory information field VmallocTotal_bytes                  | gauge      |
| node_memory_VmallocUsed_bytes            | Memory information field VmallocUsed_bytes                   | gauge      |
| node_memory_WritebackTmp_bytes           | Memory information field WritebackTmp_bytes                  | gauge      |
| node_memory_Writeback_bytes              | Memory information field Writeback_bytes                     | gauge      |
| node_netstat_Icmp6_InErrors              | Statistic Icmp6InErrors                                      | gauge      |
| node_netstat_Icmp6_InMsgs                | Statistic Icmp6InMsgs                                        | gauge      |
| node_netstat_Icmp6_OutMsgs               | Statistic Icmp6OutMsgs                                       | gauge      |
| node_netstat_Icmp_InErrors               | Statistic IcmpInErrors                                       | gauge      |
| node_netstat_Icmp_InMsgs                 | Statistic IcmpInMsgs                                         | gauge      |
| node_netstat_Icmp_OutMsgs                | Statistic IcmpOutMsgs                                        | gauge      |
| node_netstat_Ip6_InOctets                | Statistic Ip6InOctets                                        | gauge      |
| node_netstat_Ip6_OutOctets               | Statistic Ip6OutOctets                                       | gauge      |
| node_netstat_IpExt_InOctets              | Statistic IpExtInOctets                                      | gauge      |
| node_netstat_IpExt_OutOctets             | Statistic IpExtOutOctets                                     | gauge      |
| node_netstat_Ip_Forwarding               | Statistic IpForwarding                                       | gauge      |
| node_netstat_TcpExt_ListenDrops          | Statistic TcpExtListenDrops                                  | gauge      |
| node_netstat_TcpExt_ListenOverflows      | Statistic TcpExtListenOverflows                              | gauge      |
| node_netstat_TcpExt_SyncookiesFailed     | Statistic TcpExtSyncookiesFailed                             | gauge      |
| node_netstat_TcpExt_SyncookiesRecv       | Statistic TcpExtSyncookiesRecv                               | gauge      |
| node_netstat_TcpExt_SyncookiesSent       | Statistic TcpExtSyncookiesSent                               | gauge      |
| node_netstat_Tcp_ActiveOpens             | Statistic TcpActiveOpens                                     | gauge      |
| node_netstat_Tcp_CurrEstab               | Statistic TcpCurrEstab                                       | gauge      |
| node_netstat_Tcp_InErrs                  | Statistic TcpInErrs                                          | gauge      |
| node_netstat_Tcp_PassiveOpens            | Statistic TcpPassiveOpens                                    | gauge      |
| node_netstat_Tcp_RetransSegs             | Statistic TcpRetransSegs                                     | gauge      |
| node_netstat_Udp6_InDatagrams            | Statistic Udp6InDatagrams                                    | gauge      |
| node_netstat_Udp6_InErrors               | Statistic Udp6InErrors                                       | gauge      |
| node_netstat_Udp6_NoPorts                | Statistic Udp6NoPorts                                        | gauge      |
| node_netstat_Udp6_OutDatagrams           | Statistic Udp6OutDatagrams                                   | gauge      |
| node_netstat_UdpLite6_InErrors           | Statistic UdpLite6InErrors                                   | gauge      |
| node_netstat_UdpLite_InErrors            | Statistic UdpLiteInErrors                                    | gauge      |
| node_netstat_Udp_InDatagrams             | Statistic UdpInDatagrams                                     | gauge      |
| node_netstat_Udp_InErrors                | Statistic UdpInErrors                                        | gauge      |
| node_netstat_Udp_NoPorts                 | Statistic UdpNoPorts                                         | gauge      |
| node_netstat_Udp_OutDatagrams            | Statistic UdpOutDatagrams                                    | gauge      |
| node_network_receive_bytes_total         | Network device statistic receive_bytes                       | cumulative |
| node_network_receive_compressed_total    | Network device statistic receive_compressed                  | cumulative |
| node_network_receive_drop_total          | Network device statistic receive_drop                        | cumulative |
| node_network_receive_errs_total          | Network device statistic receive_errs                        | cumulative |
| node_network_receive_fifo_total          | Network device statistic receive_fifo                        | cumulative |
| node_network_receive_frame_total         | Network device statistic receive_frame                       | cumulative |
| node_network_receive_multicast_total     | Network device statistic receive_multicast                   | cumulative |
| node_network_receive_packets_total       | Network device statistic receive_packets                     | cumulative |
| node_network_transmit_bytes_total        | Network device statistic transmit_bytes                      | cumulative |
| node_network_transmit_carrier_total      | Network device statistic transmit_carrier                    | cumulative |
| node_network_transmit_colls_total        | Network device statistic transmit_colls                      | cumulative |
| node_network_transmit_compressed_total   | Network device statistic transmit_compressed                 | cumulative |
| node_network_transmit_drop_total         | Network device statistic transmit_drop                       | cumulative |
| node_network_transmit_errs_total         | Network device statistic transmit_errs                       | cumulative |
| node_network_transmit_fifo_total         | Network device statistic transmit_fifo                       | cumulative |
| node_network_transmit_packets_total      | Network device statistic transmit_packets                    | cumulative |
| node_nf_conntrack_entries                | Number of currently allocated flow entries for connection tracking | gauge      |
| node_nf_conntrack_entries_limit          | Maximum size of connection tracking table                    | gauge      |
| node_procs_blocked                       | Number of processes blocked waiting for I/O to complete      | gauge      |
| node_procs_running                       | Number of processes in runnable state                        | gauge      |
| node_scrape_collector_duration_seconds   | Duration of a collector scrape                               | gauge      |
| node_scrape_collector_success            | Whether a collector succeeded                                | gauge      |
| node_sockstat_FRAG_inuse                 | Number of FRAG sockets in state inuse                        | gauge      |
| node_sockstat_FRAG_memory                | Number of FRAG sockets in state memory                       | gauge      |
| node_sockstat_RAW_inuse                  | Number of RAW sockets in state inuse                         | gauge      |
| node_sockstat_TCP_alloc                  | Number of TCP sockets in state alloc                         | gauge      |
| node_sockstat_TCP_inuse                  | Number of TCP sockets in state inuse                         | gauge      |
| node_sockstat_TCP_mem                    | Number of TCP sockets in state mem                           | gauge      |
| node_sockstat_TCP_mem_bytes              | Number of TCP sockets in state mem_bytes                     | gauge      |
| node_sockstat_TCP_orphan                 | Number of TCP sockets in state orphan                        | gauge      |
| node_sockstat_TCP_tw                     | Number of TCP sockets in state tw                            | gauge      |
| node_sockstat_UDPLITE_inuse              | Number of UDPLITE sockets in state inuse                     | gauge      |
| node_sockstat_UDP_inuse                  | Number of UDP sockets in state inuse                         | gauge      |
| node_sockstat_UDP_mem                    | Number of UDP sockets in state mem                           | gauge      |
| node_sockstat_UDP_mem_bytes              | Number of UDP sockets in state mem_bytes                     | gauge      |
| node_sockstat_sockets_used               | Number of sockets sockets in state used                      | gauge      |
| node_textfile_scrape_error               | 1 if there was an error opening or reading a file, 0 otherwise | gauge      |
| node_time_seconds                        | System time in seconds since epoch (1970)                    | gauge      |
| node_uname_info                          | Labeled system information as provided by the uname system call | gauge      |
| node_vmstat_pgfault                      | /proc/vmstat information field pgfault                       | gauge      |
| node_vmstat_pgmajfault                   | /proc/vmstat information field pgmajfault                    | gauge      |
| node_vmstat_pgpgin                       | /proc/vmstat information field pgpgin                        | gauge      |
| node_vmstat_pgpgout                      | /proc/vmstat information field pgpgout                       | gauge      |
| node_vmstat_pswpin                       | /proc/vmstat information field pswpin                        | gauge      |
| node_vmstat_pswpout                      | /proc/vmstat information field pswpout                       | gauge      |


## cAdvisor metrics

> 출처 : https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md

|                                                    |         |                                                              |                         |                   |                       |
| -------------------------------------------------- | ------- | ------------------------------------------------------------ | ----------------------- | ----------------- | --------------------- |
| Metric name                                        | Type    | Description                                                  | Unit (where applicable) | option parameter  | additional build flag |
| `container_accelerator_duty_cycle`                 | Gauge   | Percent of time over the past sample period during which the accelerator was actively processing | percentage              | accelerator       |                       |
| `container_accelerator_memory_total_bytes`         | Gauge   | Total accelerator memory                                     | bytes                   | accelerator       |                       |
| `container_accelerator_memory_used_bytes`          | Gauge   | Total accelerator memory allocated                           | bytes                   | accelerator       |                       |
| `container_blkio_device_usage_total`               | Counter | Blkio device bytes usage                                     | bytes                   | diskIO            |                       |
| `container_cpu_cfs_periods_total`                  | Counter | Number of elapsed enforcement period intervals               |                         | cpu               |                       |
| `container_cpu_cfs_throttled_periods_total`        | Counter | Number of throttled period intervals                         |                         | cpu               |                       |
| `container_cpu_cfs_throttled_seconds_total`        | Counter | Total time duration the container has been throttled         | seconds                 | cpu               |                       |
| `container_cpu_load_average_10s`                   | Gauge   | Value of container cpu load average over the last 10 seconds |                         | cpuLoad           |                       |
| `container_cpu_schedstat_run_periods_total`        | Counter | Number of times processes of the cgroup have run on the cpu  |                         | sched             |                       |
| `container_cpu_schedstat_runqueue_seconds_total`   | Counter | Time duration processes of the container have been waiting on a runqueue | seconds                 | sched             |                       |
| `container_cpu_schedstat_run_seconds_total`        | Counter | Time duration the processes of the container have run on the CPU | seconds                 | sched             |                       |
| `container_cpu_system_seconds_total`               | Counter | Cumulative system cpu time consumed                          | seconds                 | cpu               |                       |
| `container_cpu_usage_seconds_total`                | Counter | Cumulative cpu time consumed                                 | seconds                 | cpu               |                       |
| `container_cpu_user_seconds_total`                 | Counter | Cumulative user cpu time consumed                            | seconds                 | cpu               |                       |
| `container_file_descriptors`                       | Gauge   | Number of open file descriptors for the container            |                         | process           |                       |
| `container_fs_inodes_free`                         | Gauge   | Number of available Inodes                                   |                         | disk              |                       |
| `container_fs_inodes_total`                        | Gauge   | Total number of Inodes                                       |                         | disk              |                       |
| `container_fs_io_current`                          | Gauge   | Number of I/Os currently in progress                         |                         | diskIO            |                       |
| `container_fs_io_time_seconds_total`               | Counter | Cumulative count of seconds spent doing I/Os                 | seconds                 | diskIO            |                       |
| `container_fs_io_time_weighted_seconds_total`      | Counter | Cumulative weighted I/O time                                 | seconds                 | diskIO            |                       |
| `container_fs_limit_bytes`                         | Gauge   | Number of bytes that can be consumed by the container on this filesystem | bytes                   | disk              |                       |
| `container_fs_reads_bytes_total`                   | Counter | Cumulative count of bytes read                               | bytes                   | diskIO            |                       |
| `container_fs_read_seconds_total`                  | Counter | Cumulative count of seconds spent reading                    |                         | diskIO            |                       |
| `container_fs_reads_merged_total`                  | Counter | Cumulative count of reads merged                             |                         | diskIO            |                       |
| `container_fs_reads_total`                         | Counter | Cumulative count of reads completed                          |                         | diskIO            |                       |
| `container_fs_sector_reads_total`                  | Counter | Cumulative count of sector reads completed                   |                         | diskIO            |                       |
| `container_fs_sector_writes_total`                 | Counter | Cumulative count of sector writes completed                  |                         | diskIO            |                       |
| `container_fs_usage_bytes`                         | Gauge   | Number of bytes that are consumed by the container on this filesystem | bytes                   | disk              |                       |
| `container_fs_writes_bytes_total`                  | Counter | Cumulative count of bytes written                            | bytes                   | diskIO            |                       |
| `container_fs_write_seconds_total`                 | Counter | Cumulative count of seconds spent writing                    | seconds                 | diskIO            |                       |
| `container_fs_writes_merged_total`                 | Counter | Cumulative count of writes merged                            |                         | diskIO            |                       |
| `container_fs_writes_total`                        | Counter | Cumulative count of writes completed                         |                         | diskIO            |                       |
| `container_hugetlb_failcnt`                        | Counter | Number of hugepage usage hits limits                         |                         | hugetlb           |                       |
| `container_hugetlb_max_usage_bytes`                | Gauge   | Maximum hugepage usages recorded                             | bytes                   | hugetlb           |                       |
| `container_hugetlb_usage_bytes`                    | Gauge   | Current hugepage usage                                       | bytes                   | hugetlb           |                       |
| `container_last_seen`                              | Gauge   | Last time a container was seen by the exporter               | timestamp               | -                 |                       |
| `container_llc_occupancy_bytes`                    | Gauge   | Last level cache usage statistics for container counted with RDT Memory Bandwidth Monitoring (MBM). | bytes                   | resctrl           |                       |
| `container_memory_bandwidth_bytes`                 | Gauge   | Total memory bandwidth usage statistics for container counted with RDT Memory Bandwidth Monitoring (MBM). | bytes                   | resctrl           |                       |
| `container_memory_bandwidth_local_bytes`           | Gauge   | Local memory bandwidth usage statistics for container counted with RDT Memory Bandwidth Monitoring (MBM). | bytes                   | resctrl           |                       |
| `container_memory_cache`                           | Gauge   | Total page cache memory                                      | bytes                   | memory            |                       |
| `container_memory_failcnt`                         | Counter | Number of memory usage hits limits                           |                         | memory            |                       |
| `container_memory_failures_total`                  | Counter | Cumulative count of memory allocation failures               |                         | memory            |                       |
| `container_memory_mapped_file`                     | Gauge   | Size of memory mapped files                                  | bytes                   | memory            |                       |
| `container_memory_max_usage_bytes`                 | Gauge   | Maximum memory usage recorded                                | bytes                   | memory            |                       |
| `container_memory_migrate`                         | Gauge   | Memory migrate status                                        |                         | cpuset            |                       |
| `container_memory_numa_pages`                      | Gauge   | Number of used pages per NUMA node                           |                         | memory_numa       |                       |
| `container_memory_rss`                             | Gauge   | Size of RSS                                                  | bytes                   | memory            |                       |
| `container_memory_swap`                            | Gauge   | Container swap usage                                         | bytes                   | memory            |                       |
| `container_memory_usage_bytes`                     | Gauge   | Current memory usage, including all memory regardless of when it was accessed | bytes                   | memory            |                       |
| `container_memory_working_set_bytes`               | Gauge   | Current working set                                          | bytes                   | memory            |                       |
| `container_network_advance_tcp_stats_total`        | Gauge   | advanced tcp connections statistic for container             |                         | advtcp            |                       |
| `container_network_receive_bytes_total`            | Counter | Cumulative count of bytes received                           | bytes                   | network           |                       |
| `container_network_receive_errors_total`           | Counter | Cumulative count of errors encountered while receiving       |                         | network           |                       |
| `container_network_receive_packets_dropped_total`  | Counter | Cumulative count of packets dropped while receiving          |                         | network           |                       |
| `container_network_receive_packets_total`          | Counter | Cumulative count of packets received                         |                         | network           |                       |
| `container_network_tcp6_usage_total`               | Gauge   | tcp6 connection usage statistic for container                |                         | tcp               |                       |
| `container_network_tcp_usage_total`                | Gauge   | tcp connection usage statistic for container                 |                         | tcp               |                       |
| `container_network_transmit_bytes_total`           | Counter | Cumulative count of bytes transmitted                        | bytes                   | network           |                       |
| `container_network_transmit_errors_total`          | Counter | Cumulative count of errors encountered while transmitting    |                         | network           |                       |
| `container_network_transmit_packets_dropped_total` | Counter | Cumulative count of packets dropped while transmitting       |                         | network           |                       |
| `container_network_transmit_packets_total`         | Counter | Cumulative count of packets transmitted                      |                         | network           |                       |
| `container_network_udp6_usage_total`               | Gauge   | udp6 connection usage statistic for container                |                         | udp               |                       |
| `container_network_udp_usage_total`                | Gauge   | udp connection usage statistic for container                 |                         | udp               |                       |
| `container_oom_events_total`                       | Counter | Count of out of memory events observed for the container     |                         | oom_event         |                       |
| `container_perf_events_scaling_ratio`              | Gauge   | Scaling ratio for perf event counter (event can be identified by `event` label and `cpu` indicates the core for which event was measured). See [perf event configuration](https://github.com/google/cadvisor/blob/master/docs/runtime_options.md#perf-events). |                         | perf_event        | libpfm                |
| `container_perf_events_total`                      | Counter | Scaled counter of perf core event (event can be identified by `event` label and `cpu` indicates the core for which event was measured). See [perf event configuration](https://github.com/google/cadvisor/blob/master/docs/runtime_options.md#perf-events). |                         | perf_event        | libpfm                |
| `container_perf_uncore_events_scaling_ratio`       | Gauge   | Scaling ratio for perf uncore event counter (event can be identified by `event` label, `pmu` and `socket` lables indicate the PMU and the CPU socket for which event was measured). See [perf event configuration](https://github.com/google/cadvisor/blob/master/docs/runtime_options.md#perf-events). Metric exists only for main cgroup (id="/"). |                         | perf_event        | libpfm                |
| `container_perf_uncore_events_total`               | Counter | Scaled counter of perf uncore event (event can be identified by `event` label, `pmu` and `socket` lables indicate the PMU and the CPU socket for which event was measured). See [perf event configuration](https://github.com/google/cadvisor/blob/master/docs/runtime_options.md#perf-events)). Metric exists only for main cgroup (id="/"). |                         | perf_event        | libpfm                |
| `container_processes`                              | Gauge   | Number of processes running inside the container             |                         | process           |                       |
| `container_referenced_bytes`                       | Gauge   | Container referenced bytes during last measurements cycle based on Referenced field in /proc/smaps file, with /proc/PIDs/clear_refs set to 1 after defined number of cycles configured through `referenced_reset_interval` cAdvisor parameter. Warning: this is intrusive collection because can influence kernel page reclaim policy and add latency. Refer to https://github.com/brendangregg/wss#wsspl-referenced-page-flag for more details. | bytes                   | referenced_memory |                       |
| `container_sockets`                                | Gauge   | Number of open sockets for the container                     |                         | process           |                       |
| `container_spec_cpu_period`                        | Gauge   | CPU period of the container                                  |                         | -                 |                       |
| `container_spec_cpu_quota`                         | Gauge   | CPU quota of the container                                   |                         | -                 |                       |
| `container_spec_cpu_shares`                        | Gauge   | CPU share of the container                                   |                         | -                 |                       |
| `container_spec_memory_limit_bytes`                | Gauge   | Memory limit for the container                               | bytes                   | -                 |                       |
| `container_spec_memory_reservation_limit_bytes`    | Gauge   | Memory reservation limit for the container                   | bytes                   |                   |                       |
| `container_spec_memory_swap_limit_bytes`           | Gauge   | Memory swap limit for the container                          | bytes                   |                   |                       |
| `container_start_time_seconds`                     | Gauge   | Start time of the container since unix epoch                 | seconds                 |                   |                       |
| `container_tasks_state`                            | Gauge   | Number of tasks in given state (`sleeping`, `running`, `stopped`, `uninterruptible`, or `ioawaiting`) |                         | cpuLoad           |                       |
| `container_threads`                                | Gauge   | Number of threads running inside the container               |                         | process           |                       |
| `container_threads_max`                            | Gauge   | Maximum number of threads allowed inside the container       |                         | process           |                       |
| `container_ulimits_soft`                           | Gauge   | Soft ulimit values for the container root process. Unlimited if -1, except priority and nice |                         | process           |                       |

